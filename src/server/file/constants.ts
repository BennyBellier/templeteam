import * as path from "path";
import { env } from "@/env.mjs";

export const associationPath = path.join(
  "public",
  env.STATIC_FOLDER,
  env.ASSOCIATION_FOLDER,
);

export const membersPath = path.join(
  associationPath,
  env.ASSOCIATION_MEMBERS_FOLDER,
);

export const tempPath = path.join(env.TEMP_FOLDER);