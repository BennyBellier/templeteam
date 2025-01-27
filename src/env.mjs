import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    DATABASE_SAVE_URL: z.string().url().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),

    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    CONTACT_FROM_MAIL: z.string().email(),
    REGISTER_MAIL: z.string().email(),
    NOREPLY_MAIL: z.string().email(),

    LOG_FOLDER: z.string().optional(),
    LOG_LEVEL: z.string().optional(),

    BLOG_PAGINATION_SIZE: z.coerce.number().min(0).max(100).default(10),
    REFERENCE_PAGINATION_SIZE: z.coerce.number().min(0).max(100).default(25),

    MEMBER_PAGINATION_SIZE: z.coerce.number().min(0).max(100).default(25),
    FILE_PAGINATION_SIZE: z.coerce.number().min(0).max(100).default(25),

    FILE_YEAR: z.preprocess((str) => {
      if (typeof str === "string") {
        const year = str.split("/")[0];
        return new Date(`${year}-09-01`);
      }
      return str; // Si ce n'est pas une chaîne, retournez-la directement
    }, z.date()),
    STATIC_FOLDER: z.string().default("static"),
    ASSOCIATION_FOLDER: z.string().default("association"),
    ASSOCIATION_MEMBERS_FOLDER: z.string().default("members"),
    ASSOCIATION_MEMBERS_PHOTOS_FOLDER: z.string().default("photos"),
    ASSOCIATION_MEMBERS_MEDICS_FOLDER: z.string().default("medical"),
    ASSOCIATION_MEMBERS_FILES_FOLDER: z.string().default("files"),
    INSURANCE_MEMBERSHIP_PRICE: z.coerce.number().default(20),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_SAVE_URL: process.env.DATABASE_SAVE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    CONTACT_FROM_MAIL: process.env.CONTACT_FROM_MAIL,
    REGISTER_MAIL: process.env.REGISTER_MAIL,
    NOREPLY_MAIL: process.env.NOREPLY_MAIL,
    LOG_FOLDER: process.env.LOG_FOLDER,
    LOG_LEVEL: process.env.LOG_LEVEL,
    BLOG_PAGINATION_SIZE: process.env.BLOG_PAGINATION,
    REFERENCE_PAGINATION_SIZE: process.env.REFERENCES_PAGINATION,
    MEMBER_PAGINATION_SIZE: process.env.MEMBER_PAGINATION_SIZE,
    FILE_PAGINATION_SIZE: process.env.FILE_PAGINATION_SIZE,
    FILE_YEAR: process.env.FILE_YEAR,
    STATIC_FOLDER: process.env.STATIC_FOLDER,
    ASSOCIATION_FOLDER: process.env.ASSOCIATION_FOLDER,
    ASSOCIATION_MEMBERS_FOLDER: process.env.ASSOCIATION_MEMBERS_FOLDER,
    ASSOCIATION_MEMBERS_PHOTOS_FOLDER: process.env.ASSOCIATION_MEMBERS_PHOTOS_FOLDER,
    ASSOCIATION_MEMBERS_MEDICS_FOLDER: process.env.ASSOCIATION_MEMBERS_MEDICS_FOLDER,
    ASSOCIATION_MEMBERS_FILES_FOLDER: process.env.ASSOCIATION_MEMBERS_FILES_FOLDER,
    INSURANCE_MEMBERSHIP_PRICE: process.env.INSURANCE_MEMBERSHIP_PRICE,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
