import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import InviteMemberForm from "@/components/InviteMemberForm";

export default async function LeaguePage({
  params,
}: {
  params: any;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // ✅ FIX: handle params being a Promise, different key name, or catch-all array
  const resolvedParams = await Promise.resolve(params);
  const raw =
    resolvedParams?.leagueId ??
    resolvedParams?.id ??
    Object.values(resolvedParams ?? {})[0];

  const leagueId = Array.isArray(raw) ? raw[0] : raw;

  if (!leagueId) {
    return (
      <div style={{ maxWidth: 900, margin: "32px auto", padding: 16 }}>
        <h1 style={{ fontSize: 28 }}>League not found</h1>
        <p style={{ opacity: 0.8 }}>Missing league id in URL.</p>
      </div>
    );
  }

  const league = await prisma.league.findUnique({
    where: { id: leagueId },
    include: {
      members: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!league) {
    return (
      <div style={{ maxWidth: 900, margin: "32px auto", padding: 16 }}>
        <h1 style={{ fontSize: 28 }}>League not found</h1>
        <p style={{ opacity: 0.8 }}>
          No league exists with id: <strong>{leagueId}</strong>
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "32px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28 }}>{league.name}</h1>
      <p style={{ opacity: 0.8 }}>{league.sport}</p>

      <h3 style={{ marginTop: 24 }}>Members</h3>
      <ul>
        {league.members.map((m: any) => (
          <li key={m.id}>
            {m.user.firstName} {m.user.lastName} — {m.role}
          </li>
        ))}
      </ul>

      <InviteMemberForm leagueId={league.id} />
    </div>
  );
}