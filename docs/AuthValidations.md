# Authentication & Authorization

The Employee Time Clock implements its own authentication and authorization system without relying on third-party authentication providers.

Authentication is based on securely hashed passwords and signed cookie sessions. Authorization is enforced server-side for both application pages and API endpoints.

## Authentication Overview

The application supports two roles:

- `EMPLOYEE`
    
- `ADMIN`
    

After successful authentication, users are redirected according to their role:

|Role|Destination|
|---|---|
|Employee|`/employee`|
|Admin|`/admin/dashboard`|

The two areas are intentionally separated. Employees cannot access administrative functionality, and administrators cannot access employee clock functionality.

---

## Password Security

Passwords are never stored as plain text.

Passwords are hashed using `bcrypt` before being stored in PostgreSQL.

The application uses:

- bcrypt password hashing
    
- 12 salt rounds
    
- secure password comparison during login
    
- no password or password hash exposure through API responses
    

Authentication always compares the submitted password against the stored password hash.

---

## Login Validation

The login endpoint validates the following conditions before creating a session.

### Required Credentials

Both email and password are required.

Missing credentials result in:

```
400 Bad Request
```

### Email Normalization

Emails are normalized before querying the database by:

- trimming surrounding whitespace
    
- converting the email to lowercase
    

### Existing User

The submitted email must belong to an existing user.

### Valid Password

The submitted password must successfully match the stored bcrypt hash.

### Active Account

The user must have:

```
isActive = true
```

Deactivated users cannot authenticate.

### Generic Authentication Errors

The application intentionally does not reveal whether:

- an email exists;
    
- a password is incorrect; or
    
- an account has been deactivated.
    

All of these cases return the same response:

```
Invalid email or password.
```

with:

```
401 Unauthorized
```

This prevents the authentication endpoint from exposing unnecessary account information.

---

## Session Security

After successful authentication, the server creates a signed session token containing only the information necessary to identify the session.

The session payload contains:

```
userId
expiresAt
```

The user's role is deliberately not trusted from the session token.

The current role and account status are retrieved from the database whenever the authenticated user is resolved.

### Session Signing

Session tokens are cryptographically signed using:

```
HMAC SHA-256
```

with a private:

```
SESSION_SECRET
```

stored in the application's environment variables.

A modified token will fail signature verification and will not produce an authenticated user.

---

## Session Cookie

The signed session is stored in a cookie named:

```
session
```

The cookie is configured with security attributes including:

```
httpOnly
sameSite = lax
path = /
secure = true in production
```

`httpOnly` prevents normal client-side JavaScript from reading the authentication cookie.

---

## Remember Me

The login form supports an optional **Remember Me** setting.

### Remember Me disabled

When the option is not selected:

- the authentication cookie is a browser-session cookie;
    
- no persistent cookie `maxAge` is configured;
    
- the signed token still has an internal expiration of 24 hours.
    

### Remember Me enabled

When selected:

- the authentication cookie persists across browser sessions;
    
- the cookie expiration is approximately 30 days;
    
- the signed token also expires after 30 days.
    

Therefore, cookie persistence does not bypass token expiration.

---

## Current User Validation

Authentication is not determined only by the presence of a cookie.

The server performs the following validation:

```
Session cookie
      ↓
Verify token signature
      ↓
Verify token expiration
      ↓
Extract userId
      ↓
Query PostgreSQL
      ↓
Verify user exists
      ↓
Verify isActive
      ↓
Return current user
```

If any step fails, the request is treated as unauthenticated.

This also means that deactivating an employee immediately prevents future authenticated requests even if that employee still has a previously valid session cookie.

---

## Page Authorization

Protected pages use server-side authorization before rendering their content.

Three authorization helpers are used:

```
requireUser()
requireEmployee()
requireAdmin()
```

### Unauthenticated Users

Users without a valid session attempting to access protected pages are redirected to:

```
/login
```

### Employee Routes

The Employee portal is restricted to users with:

```
role = EMPLOYEE
```

An Admin attempting to access:

```
/employee
```

is redirected to:

```
/admin/dashboard
```

### Admin Routes

All routes under:

```
/admin/*
```

are restricted to users with:

```
role = ADMIN
```

An Employee attempting to access an Admin route is redirected to:

```
/employee
```

This creates strict role separation:

```
EMPLOYEE → /employee
ADMIN    → /admin/*
```

Administrators therefore do not receive access to employee Clock In or Clock Out functionality.

---

## API Authorization

Page protection is not considered sufficient security.

Every protected API endpoint must independently verify the authenticated user and the required role.

API-specific authorization helpers are provided:

```
requireApiUser()
requireApiEmployee()
requireApiAdmin()
```

Unlike page authorization helpers, API authorization does not redirect users.

Instead, API endpoints return appropriate HTTP status codes.

### Missing or Invalid Authentication

```
401 Unauthorized
```

### Authenticated User With Incorrect Role

```
403 Forbidden
```

For example, an Admin attempting to manually call an Employee-only clock endpoint must receive:

```
403 Forbidden
```

even though the corresponding Clock In/Out controls are not available in the Admin interface.

Authorization therefore never depends exclusively on hiding UI elements.

---

## Current User Endpoint

The application exposes:

```
GET /api/auth/me
```

for retrieving the currently authenticated user.

The endpoint is available to both authenticated roles.

The response only exposes safe user information:

```
id
firstName
lastName
email
role
```

Sensitive or unnecessary fields such as the password hash are never returned.

An unauthenticated request receives:

```
401 Unauthorized
```

---

## Logout

Logout is performed through:

```
POST /api/auth/logout
```

The server deletes the authentication cookie and the client returns the user to:

```
/login
```

After logout, protected pages can no longer be accessed with the previous session.

---

## Deactivated Accounts

Administrators can deactivate Employee accounts without deleting them.

A deactivated account:

- cannot log in;
    
- cannot continue using an existing authenticated session;
    
- keeps its database record;
    
- retains historical data associated with the account.
    

Because the current user is validated against PostgreSQL on authenticated requests, an existing signed cookie does not allow a deactivated account to continue accessing protected functionality.

---

## Invalid or Tampered Sessions

Signed session tokens are verified before they are trusted.

If the session token is manually modified, corrupted, incorrectly signed, or otherwise invalid, authentication fails.

For protected pages:

```
Invalid session → /login
```

For protected APIs:

```
Invalid session → 401 Unauthorized
```

This behavior applies even if the browser still contains a cookie named `session`.

---

## Authentication Security Tests

The authentication system has been manually tested against the following scenarios:

|Test|Expected Result|
|---|---|
|Employee login with valid credentials|Redirect to `/employee`|
|Admin login with valid credentials|Redirect to `/admin/dashboard`|
|Invalid password|`401` / login rejected|
|Nonexistent account|`401` / login rejected|
|Deactivated account|`401` / login rejected|
|Employee accesses `/admin/*`|Redirect to `/employee`|
|Admin accesses `/employee`|Redirect to `/admin/dashboard`|
|Protected page without session|Redirect to `/login`|
|Protected API without session|`401 Unauthorized`|
|API accessed with incorrect role|`403 Forbidden`|
|`/api/auth/me` as Employee|Employee information returned|
|`/api/auth/me` as Admin|Admin information returned|
|`/api/auth/me` without session|`401 Unauthorized`|
|Logout|Session cookie removed|
|Remember Me disabled|Browser-session cookie|
|Remember Me enabled|Persistent 30-day cookie|
|Account deactivated during active session|Access revoked on next request|
|Manually modified session cookie|Session rejected|
|Protected page with modified cookie|Redirect to `/login`|
|Protected API with modified cookie|`401 Unauthorized`|

---

## Authorization Principle

The application follows one central authorization rule:

> The client interface does not determine whether an action is authorized. The server does.

UI controls may be hidden or disabled according to the current user's role, but every protected operation must still validate the authenticated user and their permissions on the server.

This principle applies to authentication as well as all Employee Clock and Admin management functionality implemented throughout the application.