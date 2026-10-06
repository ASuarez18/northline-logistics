import { getCurrentUser } from "./current-user";

export async function requireActionAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      error: "You must be signed in as an admin.",
    } as const;
  }

  if (user.role !== "ADMIN") {
    return {
      user: null,
      error: "You are not authorized to perform this action.",
    } as const;
  }

  return {
    user,
    error: null,
  } as const;
}