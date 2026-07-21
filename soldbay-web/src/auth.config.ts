import type { NextAuthConfig } from "next-auth"
import type { UserRole } from "@/generated/prisma/enums"

/**
 * Edge-compatible Auth.js config (no Node-only deps like Prisma/bcrypt).
 * Used by middleware. Full config with Credentials + adapter lives in auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized() {
      // Route protection is handled explicitly in middleware.ts
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!
        token.role = (user as { role: UserRole }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
} satisfies NextAuthConfig
