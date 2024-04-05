import { env } from "@/env.mjs";
import type { User } from "@prisma/client";
import { decode, encode, type JWT } from "next-auth/jwt";

export type AuthUser = Omit<User, "Password">;

export const tokenOneDay = 24 * 60 * 60;
export const tokenOnWeek = tokenOneDay * 7;

const createJWT = (token: JWT, duration: number) =>
  encode({ token, secret: env.NEXTAUTH_SECRET!, maxAge: duration });

export const jwtHelper = {
  createAcessToken: (token: JWT) => createJWT(token, tokenOneDay),
  createRefreshToken: (token: JWT) => createJWT(token, tokenOnWeek),
  verifyToken: (token: string) =>
    decode({ token, secret: env.NEXTAUTH_SECRET! }),
};
