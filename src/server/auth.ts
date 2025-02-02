import LoginErrors from "@/lib/loginErrors";
import { prisma } from "@/server/db";
import logger from "@/server/logger";
import { compare } from "bcrypt";
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
          logger.error({
            message: "Invalid credentials !",
            context: "Authentication",
            data: parsedCredentials.error,
          });
          throw new Error(LoginErrors.INVALID_INFORMATIONS as string);
        }

        const { identifier, password } = parsedCredentials.data;

        logger.info({message: `${identifier} try to connect`, context: "Authentication"});

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { name: identifier }],
          },
        });

        if (!user) {
          logger.error({message: `${identifier} doesn't exist as user`, context: "Authentication"});
          throw new Error(LoginErrors.USER_NOT_FOUND);
        }

        const passwordMatch = await compare(password, user.password);
        if (!passwordMatch) {
          logger.error({
            message: `${identifier} password incorrect !`,
            context: "Authentication",
          });
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
      logger.error({message: code, context: "Authentication", data: metadata});
    },
    warn(code) {
      logger.warn({message: code, context: "Authentication"});
    },
    debug(code, metadata) {
      logger.debug({
        message: code,
        context: "Authentication",
        data: metadata,
      });
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
