import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { leagueId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // ✅ REQUIRED: get the sender (logged-in user) id for fromUserId
  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // prevent duplicate invite
  const existingInvite = await prisma.leagueInvite.findUnique({
    where: {
      leagueId_email: {
        leagueId: params.leagueId,
        email,
      },
    },
  });

  if (existingInvite) {
    return NextResponse.json({ error: "Invite already exists" }, { status: 400 });
  }

  await prisma.leagueInvite.create({
    data: {
      leagueId: params.leagueId,
      email,
      role: "MEMBER",
      fromUserId: me.id, // ✅ REQUIRED
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}