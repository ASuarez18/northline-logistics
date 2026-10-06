import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth/session";

const SESSION_COOKIE_NAME = "session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

/**
 * @function requireUser
 * @description Ensures that a user is authenticated. If not, redirects to the login page
 * @returns {Promise<User>} The authenticated user
 * @throws {Redirect} Redirects to the login page if the user is not authenticated
 */
export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * @function requireAdmin
 * @description Ensures that the authenticated user has an admin role. If not, redirects to the home page
 * @returns {Promise<User>} The authenticated admin user
 * @throws {Redirect} Redirects to the home page if the user is not an admin
 */
export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/employee");
  }

  return user;
}