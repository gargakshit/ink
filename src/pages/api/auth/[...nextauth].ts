import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { generateSlug, prisma } from "@/lib/db";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const u = await prisma.user.findFirst({
        where: {
          email: user.email!,
        },
        select: { id: true },
      });

      if (u === null) {
        // Create a new user
        await prisma.user.create({
          data: {
            name: user.name!,
            email: user.email!,
            avatar: user.image!,
            slug: generateSlug(user.name!),
          },
        });
      }

      return true;
    },
  },
});
