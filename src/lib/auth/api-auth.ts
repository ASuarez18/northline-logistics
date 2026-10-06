import { getCurrentUser } from "@/lib/auth/current-user";

// @YokoyamaTogo @keisei-dev 
// This will be used in the API routes to check if the user is authenticated and has the required role (ADMIN or EMPLOYEE) to access the route. If the user is not authenticated or does not have the required role, an error message will be returned.

/**
 * @function requireApiUser
 * @description This function checks if a user is authenticated and returns the user object if they are.
 *              If the user is not authenticated, it returns an error message
 * @returns {Promise<{ user: User | null; error: "UNAUTHORIZED" | null }>} An object containing the user and an error message if applicable
 */
export async function requireApiUser() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      error: "UNAUTHORIZED" as const,
    };
  }

  return {
    user,
    error: null,
  };
}

/**
 * @function requireApiEmployee
 * @description This function checks if a user is authenticated and has the role of "EMPLOYEE".
 *              If the user is not authenticated or does not have the required role, an error message will be returned.
 * @returns {Promise<{ user: User | null; error: "UNAUTHORIZED" | "FORBIDDEN" | null }>} An object containing the user and an error message if applicable
 */
export async function requireApiEmployee() {
  const result = await requireApiUser();

  if (!result.user) {
    return result;
  }

  if (result.user.role !== "EMPLOYEE") {
    return {
      user: null,
      error: "FORBIDDEN" as const,
    };
  }

  return {
    user: result.user,
    error: null,
  };
}

/**
 * @function requireApiAdmin
 * @description This function checks if a user is authenticated and has the role of "ADMIN".
 *              If the user is not authenticated or does not have the required role, an error message will be returned.
 * @returns {Promise<{ user: User | null; error: "UNAUTHORIZED" | "FORBIDDEN" | null }>} An object containing the user and an error message if applicable
 */
export async function requireApiAdmin() {
  const result = await requireApiUser();

  if (!result.user) {
    return result;
  }

  if (result.user.role !== "ADMIN") {
    return {
      user: null,
      error: "FORBIDDEN" as const,
    };
  }

  return {
    user: result.user,
    error: null,
  };
}