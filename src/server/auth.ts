import LoginErrors from "@/lib/loginErrors";
import { prisma } from "@/server/db";
import logger from "@/server/logger";
import { compare, hash } from "bcrypt";
import { type NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ identifier: z.string(), password: z.string() })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          logger.error("Invalid credentials:", parsedCredentials.error);
          throw new Error(LoginErrors.INVALID_INFORMATIONS as string);
        }

        const { identifier, password } = parsedCredentials.data;

        logger.info(`${identifier} try to connect`);

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { name: identifier }],
          },
        });

        if (!user) {
          logger.error(`${identifier} doesn't exist as user`);
          throw new Error(LoginErrors.USER_NOT_FOUND);
        }

        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
          logger.error(`${identifier} password incorrect !`);
          throw new Error(LoginErrors.USER_PASSWORD_MISSMATCH);
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  logger: {
    error(code, metadata) {
      logger.error(code, metadata);
    },
    warn(code) {
      logger.warn(code);
    },
    debug(code, metadata) {
      logger.debug(code, metadata);
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
