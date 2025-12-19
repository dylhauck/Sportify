"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      style={{
        marginTop: 20,
        padding: "10px 16px",
        borderRadius: 6,
        border: "1px solid #ccc",
        cursor: "pointer",
      }}
    >
      Sign out
    </button>
  );
}