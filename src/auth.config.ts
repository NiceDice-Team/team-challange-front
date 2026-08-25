import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authSecret =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "development" ? "dev-secret" : undefined) ||
  (process.env.NEXT_PHASE === "phase-production-build"
    ? "build-placeholder"
    : undefined);

if (!authSecret) {
  throw new Error("AUTH_SECRET or NEXTAUTH_SECRET is required in production");
}

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required");
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
  ],

  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: authSecret,

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.provider = token.provider as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
