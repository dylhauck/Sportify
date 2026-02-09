import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 18px",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <Link href="/" style={{ fontWeight: 700 }}>
        Sportify
      </Link>

      <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/leagues/new">Create League</Link>

        {!session ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign up</Link>
          </>
        ) : (
          <>
            <span style={{ fontSize: 14, opacity: 0.8 }}>
              {session.user?.name ?? session.user?.email}
            </span>
            <SignOutButton />
          </>
        )}
      </nav>
    </header>
  );
}