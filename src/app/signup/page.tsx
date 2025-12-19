"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      // 1) Create account
      const resp = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username,
          firstName,
          lastName,
          password,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setErr(data?.error ?? "Signup failed");
        setLoading(false);
        return;
      }

      // 2) Auto-login
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!login || login.error) {
        setErr("Account created, but sign-in failed. Please log in.");
        setLoading(false);
        router.push("/login");
        return;
      }

      // 3) Go to dashboard
      setLoading(false);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
      setErr("Signup failed");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Create account</h1>

      <input
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <input
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <input
        placeholder="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <input
        placeholder="Password (min 8 characters)"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      {err && (
        <div style={{ color: "crimson", marginTop: 10, fontSize: 14 }}>
          {err}
        </div>
      )}

      <button
        disabled={loading}
        style={{ width: "100%", padding: 10, marginTop: 12 }}
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        Already have an account?{" "}
        <a href="/login" style={{ textDecoration: "underline" }}>
          Log in
        </a>
      </div>
    </form>
  );
}