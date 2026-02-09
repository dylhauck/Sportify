// src/app/dashboard/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Header from "@/components/Header";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Not logged in -> send to login
  if (!session) {
    redirect("/login");
  }

  return (
    <>
        {children}
    </>
  );
}