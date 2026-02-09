"use client";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function LeaguePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const me = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!me) redirect("/login");

  const membership = await prisma.leagueMember.findUnique({
    where: { leagueId_userId: { leagueId: params.id, userId: me.id } },
    select: {
      role: true,
      league: {
        select: {
          id: true,
          name: true,
          sport: true,
          createdAt: true,
        },
      },
    },
  });

  if (!membership) {
    return (
      <div style={{ maxWidth: 720, margin: "40px auto" }}>
        <h1>Not authorized</h1>
        <p>You’re not a member of this league.</p>
      </div>
    );
  }

  const league = membership.league;
  const isOwner = membership.role === "OWNER";

  // members list
  const members = await prisma.leagueMember.findMany({
    where: { leagueId: params.id },
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // ✅ Step 3C: pending invites
  const invites = isOwner
    ? await prisma.leagueInvite.findMany({
        where: { leagueId: params.id },
        orderBy: { createdAt: "asc" },
      })
    : [];

  return (
    <div style={{ maxWidth: 720, margin: "40px auto" }}>
      <h1>{league.name}</h1>
      <p>
        Sport: <b>{league.sport}</b>
      </p>
      <p>
        Your role: <b>{membership.role}</b>
      </p>

      <h3 style={{ marginTop: 24 }}>Members</h3>
      <ul>
        {members.map((m) => (
          <li key={m.id}>
            {m.user.firstName} {m.user.lastName} — {m.role}
          </li>
        ))}
      </ul>

      {isOwner && (
        <>
          <h3 style={{ marginTop: 24 }}>Pending Invites</h3>
          {invites.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No pending invites.</p>
          ) : (
            <ul>
              {invites.map((invite) => (
                <li key={invite.id}>{invite.email}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}