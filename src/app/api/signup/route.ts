import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email ?? "").toLowerCase().trim();
    const password = String(body.password ?? "");
    const username = String(body.username ?? "").trim();
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();

    if (!email || !password || !username || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // prevent dupes
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: username.toLowerCase() }, // if you want username case-insensitive
        ],
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email or username already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username: username.toLowerCase(),
        firstName,
        lastName,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Signup failed" },
      { status: 500 }
    );
  }
}