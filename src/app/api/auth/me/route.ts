import { NextResponse } from "next/server";

import { requireApiUser } from "@/lib/auth/api-auth";

export async function GET() {
  const { user, error } = await requireApiUser();

  if (error === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
} 