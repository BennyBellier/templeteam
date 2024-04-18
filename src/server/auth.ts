import { env } from "@/env.mjs";
import {
  jwtHelper,
  tokenOnWeek,
  tokenOneDay,
} from "@/lib/jwtHelper";
import loginErrors from "@/lib/loginErrors";
import { prisma } from "@/server/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
  type User,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { logger } from "./logger";

declare module "next-auth" {
  interface User {
    name?: string;
    email?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id?: string;
    } & DefaultSession["user"];
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpired: number;
    refreshTokenExpired: number;
    error?: "RefreshAccessTokenError";
  }
}

const LoginDelay = 2000;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    async jwt({ token, user }) {
      // credentials provider:  Save the access token and refresh token in the JWT on the initial login
      if (user) {
        const accessToken = await jwtHelper.createAcessToken(token);
        const refreshToken = await jwtHelper.createRefreshToken(token);
        const accessTokenExpired = Date.now() / 1000 + tokenOneDay;
        const refreshTokenExpired = Date.now() / 1000 + tokenOnWeek;

        return {
          ...token,
          accessToken,
          refreshToken,
          accessTokenExpired,
          refreshTokenExpired,
        };
      } else {
        if (token) {
          // In subsequent requests, check access token has expired, try to refresh it
          if (Date.now() / 1000 > token.accessTokenExpired) {
            const verifyToken = await jwtHelper.verifyToken(token.refreshToken);

            if (verifyToken) {
              const user = await prisma.user.findFirst({
                where: {
                  name: token.name,
                },
              });

              if (user) {
                const accessToken = await jwtHelper.createAcessToken(token);
                const accessTokenExpired = Date.now() / 1000 + tokenOneDay;

                return {
                  ...token,
                  accessToken,
                  accessTokenExpired,
                };
              }
            }

            return { ...token, error: "RefreshAccessTokenError" };
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          name: token.name,
          id: token.sub,
        };
      }
      session.error = token.error;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      authorize: async (credentials, _req) => {
        if (!credentials?.password) {
          // Adding 1.5 s time to response to avoid bruteforce and DDOS
          await new Promise((resolve) => setTimeout(resolve, LoginDelay));

          logger.warn("Loggin try with no password");

          throw new Error("No password", {
            cause: loginErrors.MISSING_PASSWORD,
          });
        }

        const parseCredentials = z
          .object({ password: z.string() })
          .safeParse(credentials);

        if (!parseCredentials.success) {
          // Adding 1.5 s time to response to avoid bruteforce and DDOS
          await new Promise((resolve) => setTimeout(resolve, LoginDelay));

          logger.warn("Loggin try with a bad password type");

          throw new Error("Invalid password", {
            cause: loginErrors.INVALID_PASSWORD,
          });
        } else {
          const { password } = parseCredentials.data;
          const login_data = await login(password);
          return login_data;
        }
      },
      credentials: {
        password: {
          label: "Password",
          type: "password",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

const login = z
  .function()
  .args(z.string())
  .implement(async (password) => {
    const user = await prisma.user.findFirst({
      where: {
        name: env.ADMIN_ID,
      },
    });
    if (!user) {
      // Adding 1.5 s time to response to avoid bruteforce and DDOS
      await new Promise((resolve) => setTimeout(resolve, LoginDelay));
      throw new Error(loginErrors.USER_NOT_FOUND);
    }
    // if user exist -> check password
    if (await compare(password, user.password)) {
      user.password = "";
      return user as User;
    } else {
      await new Promise((resolve) => setTimeout(resolve, LoginDelay));
      logger.warn("User: ", user, " try to loggin with not matching password");
      throw new Error(loginErrors.USER_PASSWORD_MISSMATCH);
    }
  });
