import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = body?.name?.trim();
  const sport = body?.sport?.trim() || "NFL";

  if (!name || name.length < 3) {
    return NextResponse.json({ error: "League name must be at least 3 characters." }, { status: 400 });
  }

  // Find the logged-in user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const league = await prisma.league.create({
    data: {
      name,
      sport,
      createdBy: {  connect: {  id: user.id }   },
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
    select: { id: true, name: true, sport: true },
  });

  return NextResponse.json({ league }, { status: 201 });
}