"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InviteMemberForm from "../../invites/[id]/InviteMemberForm";

export default function NewLeaguePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sport, setSport] = useState("NFL");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/leagues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sport }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      alert(data?.error ?? "Failed to create league");
      return;
    }

    router.push(`/leagues/${data.league.id}`);
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Create League</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="League name (ex: Hauck Fantasy League)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 10 }}
        />

        <select value={sport} onChange={(e) => setSport(e.target.value)} style={{ padding: 10 }}>
          <option value="NFL">NFL</option>
          <option value="NBA">NBA</option>
          <option value="MLB">MLB</option>
          <option value="NHL">NHL</option>
        </select>

        <button disabled={loading} style={{ padding: 10 }}>
          {loading ? "Creating..." : "Create league"}
        </button>
      </form>
    </div>
  );
}