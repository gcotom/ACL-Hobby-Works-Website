import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * Catch-all route for /api/auth/* (signin, signout, callback, session, csrf).
 * In v5, destructure GET/POST from the `handlers` object returned by NextAuth().
 */
export const {
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      // request email explicitly (works even if GitHub email is private)
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  session: { strategy: "jwt" },
});
