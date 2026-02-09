import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import SignOutButton from "@/components/SignOutButton";
import Link from "next/link";
import { prisma } from "@/lib/prisma"; // ✅ added

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // dashboard/layout.tsx already redirects, but keeping this safe:
  if (!session?.user?.email) return null;

  const name =
    session.user.name ??
    session.user.email ??
    "Unknown";

  // ✅ added: get user id
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  // ✅ added: get leagues for user
  const leagues = user
    ? await prisma.league.findMany({
        where: {
          members: {
            some: { userId: user.id },
          },
        },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, sport: true },
      })
    : [];

  return (
    <div style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Dashboard</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Signed in as <strong>{name}</strong>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        <div style={cardStyle}>
          <h3 style={cardTitle}>Teams</h3>

          {leagues.length === 0 ? (
            <p style={cardText}>Once you join a league, teams will show here.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              {leagues.map((l) => (
  <li key={l.id}>
    <Link
      href={`/dashboard/leagues/${l.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <strong>{l.name}</strong>{" "}
      <span style={{ opacity: 0.7 }}>({l.sport})</span>
    </Link>
  </li>
))}
            </ul>
          )}
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>Leagues</h3>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>
              <Link href="/dashboard/leagues/new" style={linkStyle}>
                Your Leagues
              </Link>
            </li>
            <li>
              <Link href="/dashboard/leagues/new" style={linkStyle}>
                Create a league
              </Link>
            </li>
            <li>
              <Link href="/dashboard/leagues/new" style={linkStyle}>
                Invite friends
              </Link>
            </li>
            <li>
              <Link href="/dashboard/leagues/new" style={linkStyle}>
                Start your draft
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e5e5",
  borderRadius: 10,
  padding: 16,
  background: "white",
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  marginBottom: 8,
  fontSize: 16,
};

const cardText: React.CSSProperties = {
  margin: 0,
  marginBottom: 12,
  opacity: 0.85,
};

const linkStyle: React.CSSProperties = {
  display: "inline-block",
  marginTop: 6,
  textDecoration: "none",
};
