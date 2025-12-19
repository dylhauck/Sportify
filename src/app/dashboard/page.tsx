import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto" }}>
      <h1>Dashboard</h1>

      <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(session, null, 2)}
      </pre>

      <SignOutButton />
    </div>
  );
}
