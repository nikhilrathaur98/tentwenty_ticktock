import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Dummy authentication: compares against users stored in the JSON database.
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await findUserByEmail(credentials.email);
        if (!user || user.password !== credentials.password) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    // Save the user id inside the encrypted session token (JWT)...
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // ...and expose it on the session object.
    session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};

/** Returns the logged-in user on the server, or null. */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}
