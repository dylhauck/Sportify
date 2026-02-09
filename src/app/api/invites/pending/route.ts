import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invites = await prisma.leagueInvite.findMany({
    where: { toUserId: me.id, status: "PENDING" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      league: { select: { id: true, name: true, sport: true } },
      fromUser: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  return NextResponse.json({ invites });
}