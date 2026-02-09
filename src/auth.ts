import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { 
          id: user.id, 
          email: user.email,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(), 
        };
      },
    }),
  ],

  callbacks: {
  async jwt({ token, user }) {
    // runs on sign-in (user is defined) and later requests (user is undefined)
    if (user) {
      token.id = (user as any).id;
      token.name = (user as any).name;
      token.email = (user as any).email;
    }
    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      (session.user as any).id = token.id;
      session.user.name = (token.name as string) ?? session.user.name;
      session.user.email = (token.email as string) ?? session.user.email;
    }
    return session;
  },
},
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};