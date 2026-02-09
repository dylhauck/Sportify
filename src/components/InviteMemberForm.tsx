"use client";

import { useState } from "react";

export default function InviteMemberForm({ leagueId }: { leagueId: string }) {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const res = await fetch(`/api/leagues/${leagueId}/invite`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        let data: any = {};
        try {
          data = await res.json();
        } catch {}

        alert(res.ok ? "Invite sent!" : data?.error || "Invite failed");
        if (res.ok) setEmail("");
      }}
      style={{ display: "flex", gap: 8, marginTop: 12 }}
    >
      <input
        type="email"
        placeholder="friend@example.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: 10,
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          width: 280,
        }}
      />
      <button type="submit" style={{ padding: "10px 14px", borderRadius: 8 }}>
        Invite
      </button>
    </form>
  );
}