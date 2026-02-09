import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const action = body?.action; // "ACCEPT" | "DECLINE"
  if (action !== "ACCEPT" && action !== "DECLINE") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const invite = await prisma.leagueInvite.findUnique({
    where: { id: params.id },
    select: { id: true, status: true, leagueId: true, toUserId: true },
  });

  if (!invite || invite.toUserId !== me.id) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (invite.status !== "PENDING") {
    return NextResponse.json({ error: "Invite already handled" }, { status: 400 });
  }

  if (action === "DECLINE") {
    await prisma.leagueInvite.update({
      where: { id: invite.id },
      data: { status: "DECLINED" },
    });
    return NextResponse.json({ ok: true });
  }

  // ACCEPT: mark invite + create membership (if not already)
  await prisma.$transaction([
    prisma.leagueInvite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED" },
    }),
    prisma.leagueMember.upsert({
      where: { leagueId_userId: { leagueId: invite.leagueId, userId: me.id } },
      update: {},
      create: { leagueId: invite.leagueId, userId: me.id, role: "MEMBER" },
    }),
  ]);

  return NextResponse.json({ ok: true, leagueId: invite.leagueId });
}