import "server-only";

import { env } from "@/env.mjs";
import logger from "@/server/logger";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { folderExist, mkdir, mv, rm, serverPath } from "./fileOps";
import { paths } from "./paths";

export async function storeFileInTmp(file: File): Promise<string> {
  if (!folderExist(paths.temp.server())) {
    mkdir(serverPath(paths.temp.server()), true);
  }

  // Generate filename and file path
  const filename = `${uuidv4()}${path.extname(file.name)}`;
  const dest = paths.temp.server(filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(dest, buffer);

  return filename;
}

export async function rmTmpFile(filename: string) {
  if (!folderExist(paths.temp.server())) {
    return;
  }

  const dest = paths.temp.server(filename);

  rm(dest);
}

/**
 * Generate the directory for members with subfolders.
 * @param id - id of the member in table Member
 */
export function generateMemberFolder(id: string): void {
  const memberPath = paths.members.root(id).server();
  if (!folderExist(memberPath)) {
    mkdir(path.join(memberPath, env.ASSOCIATION_MEMBERS_PHOTOS_FOLDER), true);
    mkdir(path.join(memberPath, env.ASSOCIATION_MEMBERS_MEDICS_FOLDER), true);
    mkdir(path.join(memberPath, env.ASSOCIATION_MEMBERS_FILES_FOLDER), true);
    logger.info({
      context: "FileManipulation",
      procedure: "generateMemberFolder",
      memberID: id,
      path: memberPath,
      message: `Member directories created`,
    });
  }
}

export async function moveFromTmpToMemberPhotoFolder(
  memberId: string,
  filename: string,
): Promise<string> {
  // Check and generate if member folder does not exist
  generateMemberFolder(memberId);

  // Get source file (in temp folder)
  const src = paths.temp.server(filename);

  // Get destination in member folder
  const dest = paths.members.photos(memberId).server(filename);

  try {
    mv(src, dest);
    return dest;
  } catch (error) {
    logger.error({
      context: "FileManipulation",
      procedure: "moveFromTmpToMemberFolder",
      message: `Failed to move file`,
      src,
      dest,
      err: error,
    });
    return "";
  }
}

export async function writeMemberFileMedic(
  memberId: string,
  file: File,
): Promise<string> {
  // Check and generate if member folder does not exist
  generateMemberFolder(memberId);

  // Generate filename and file path for the photo
  const filename = `${uuidv4()}_${Date.now()}${path.extname(file.name)}`;
  const filePath = paths.members.medical(memberId).server(filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return filename;
}

export async function writeMemberFile(
  memberId: string,
  file: Uint8Array,
): Promise<string> {
  // Check and generate if member folder does not exist
  generateMemberFolder(memberId);

  // Generate filename and file path for the photo
  const filename = `${uuidv4()}_${Date.now()}.pdf}`;
  const filePath = paths.members.photos(memberId).server(filename);

  fs.writeFileSync(filePath, file);

  return filename;
}
