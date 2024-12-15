// import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
// import bcrypt from "bcrypt";
import { prisma } from "@/server/db"; // Chemin vers votre instance Prisma
import { type NextAuthOptions, getServerSession } from "next-auth";
// import { z } from "zod";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // session: {
  //   strategy: "jwt",
  // },
  // providers: [
  //   CredentialsProvider({
  //     name: "Credentials",
  //     credentials: {
  //       identifier: { label: "Username or Email", type: "text", placeholder: "jsmith" },
  //       password: { label: "Password", type: "password" },
  //     },
  //     async authorize(credentials) {
  //       const parsedCredentials = z
  //           .object({ identifier: z.string(), password: z.string() })
  //           .safeParse(credentials);

  //       if (!parsedCredentials.success) {
  //           console.error("Invalid credentials:", parsedCredentials.error);
  //           return null;
  //       }


  //       const { identifier, password } = parsedCredentials.data;
  //       const user = await prisma.user.findFirst({
  //         where: {
  //           OR: [{ email: identifier }, { name: identifier }],
  //         },
  //       });

  //       if (!user || !user?.password) {
  //         return null;
  //       }

  //       const passwordMatch = await bcrypt.compare(password, user.password);
  //       if (!passwordMatch) {
  //         return null;
  //       }
  //       return user;
  //     },
  //   }),
  // ],
  // callbacks: {
  //   async jwt({ token, user }) {
  //       if (user) {
  //           token.id = user.id;
  //           token.role = user.role;
  //       }
  //       return token;
  //   },
  //   async session({ session, token }) {
  //       if (session?.user) {
  //           session.user.id = token.id as string;
  //           session.user.role = token.role as string;
  //       }
  //       return session;
  //   },
  // },
  // pages: {
  //   signIn: "/login",
  // },
};

export const getServerAuthSession = () => getServerSession(authOptions);
