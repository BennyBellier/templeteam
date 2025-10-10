import { env } from "@/env.mjs";
import { prisma } from "@/server/db";
import {
  ac,
  developerRole,
  memberRole,
  presidentRole,
  secretaryRole,
  treasurerRole,
} from "@/server/permissions";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: ["http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  allowUserRegistration: false,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      ac,
      roles: {
        Developer: developerRole,
        President: presidentRole,
        Treasurer: treasurerRole,
        Secretary: secretaryRole,
        Member: memberRole,
      },
      defaultRole: "Member",
      adminRoles: ["Developer", "President"],
    }),
    nextCookies(),
  ],
});
