// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // Find the logged-in user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  if (!user) redirect("/login");

  // Fetch leagues where the user is a member
  const leagues = await prisma.league.findMany({
    where: {
      members: {
        some: { userId: user.id },
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      sport: true,
      createdAt: true,
    },
  });

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Dashboard</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Signed in as {user.firstName} {user.lastName}
      </p>

      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Your Leagues</h2>
          <Link href="/dashboard/leagues/new">Create League →</Link>
        </div>

        <div style={{ marginTop: 12, border: "1px solid #e5e5e5", borderRadius: 10 }}>
          {leagues.length === 0 ? (
            <div style={{ padding: 16, opacity: 0.8 }}>No leagues yet.</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {leagues.map((l) => (
                <li key={l.id} style={{ padding: 14, borderTop: "1px solid #eee" }}>
                  <div style={{ fontWeight: 700 }}>{l.name}</div>
                  <div style={{ opacity: 0.75, fontSize: 14 }}>
                    {l.sport} • Created {new Date(l.createdAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}