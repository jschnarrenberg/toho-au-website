import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      authorization: { params: { scope: "identify" } },
    }),
  ],
  callbacks: {
    // Stash the real Discord user ID on the token (needed for the mention in Discord).
    async jwt({ token, profile }) {
      if (profile) token.discordId = profile.id;
      return token;
    },
    // Expose it on the session so the app can read it server-side.
    async session({ session, token }) {
      if (token.discordId) session.user.id = token.discordId;
      return session;
    },
  },
});
