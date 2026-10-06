import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

/**
 * @POST Login
 * @returns {Promise<NextResponse>} A JSON response containing the user data and redirect URL, or an error message
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    const password = typeof body.password === "string" ? body.password : "";

    const rememberMe = body.rememberMe === true;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const passwordIsValid = await verifyPassword(password, user.passwordHash);

    if (!passwordIsValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    await createSession(user.id, rememberMe);

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      redirectTo: user.role === "ADMIN" ? "/admin/dashboard" : "/employee",
    });
  } catch (error) {
    console.error("Login failed:", error);

    return NextResponse.json({ error: "Unable to login." }, { status: 500 });
  }
}
