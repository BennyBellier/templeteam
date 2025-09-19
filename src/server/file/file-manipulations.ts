import "server-only";

import { env } from "@/env.mjs";
import logger from "@/server/logger";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { membersPath, tempPath } from "./constants";
import { folderExist, mkdir, mv, serverPath } from "./utils";

export async function storeFileInTmp(file: File): Promise<string> {
  if (!folderExist(env.TEMP_FOLDER)) {
    mkdir(serverPath(env.TEMP_FOLDER), true);
  }

  // Generate filename and file path
  const filename = `${uuidv4()}${path.extname(file.name)}`;
  const filePath = serverPath(env.TEMP_FOLDER, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return filename;
}

/**
 * Generate the directory for members with subfolders.
 * @param id - id of the member in table Member
 */
export function generateMemberFolder(id: string): void {
  if (!folderExist(membersPath, id)) {
    const memberPath = serverPath(membersPath, id);

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

export async function moveFromTmpToMemberFolder(
  memberId: string,
  filename: string,
): Promise<string> {
  // Check and generate if member folder does not exist
  generateMemberFolder(memberId);

  // Get source file (in temp folder)
  const src = serverPath(tempPath, filename);

  // Get destination in member folder
  const dest = serverPath(
    membersPath,
    memberId,
    env.ASSOCIATION_MEMBERS_PHOTOS_FOLDER,
    filename,
  );
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
      err: error
    })
    return "";
  }
}

/**
 *
 */
/* export async function writeMemberPhoto(
  id: string,
  file: File,
): Promise<string> {
  // Check and generate if member folder does not exist
  generateMemberFolder(id);

  // Get members/{id}/photo folder path
  const memberPhotoPath = serverPath(
    membersPath,
    id,
    env.ASSOCIATION_MEMBERS_PHOTOS_FOLDER,
  );

  // Generate filename and file path for the photo
  const filename = `${uuidv4()}_${Date.now()}${path.extname(file.name)}`;
  const filePath = path.join(memberPhotoPath, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return filename;
} */

export async function writeMemberFileMedic(
  memberId: string,
  file: File,
): Promise<string> {
  // Check and generate if member folder does not exist
  generateMemberFolder(memberId);

  // Get members/{id}/photo folder path
  const memberMedicPath = serverPath(
    membersPath,
    memberId,
    env.ASSOCIATION_MEMBERS_MEDICS_FOLDER,
  );

  // Generate filename and file path for the photo
  const filename = `${uuidv4()}_${Date.now()}${path.extname(file.name)}`;
  const filePath = path.join(memberMedicPath, filename);

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

  // Get members/{id}/photo folder path
  const memberFilePath = serverPath(
    membersPath,
    memberId,
    env.ASSOCIATION_MEMBERS_FILES_FOLDER,
  );

  // Generate filename and file path for the photo
  const filename = `${uuidv4()}_${Date.now()}.pdf}`;
  const filePath = path.join(memberFilePath, filename);

  fs.writeFileSync(filePath, file);

  return filename;
}

export const getMemberPhotoPath = (memberId: string, photoFileName: string) =>
  serverPath(
    membersPath,
    memberId,
    env.ASSOCIATION_MEMBERS_PHOTOS_FOLDER,
    photoFileName,
  );

export const getMemberMedicPath = (memberId: string, medicFileName: string) =>
  serverPath(
    membersPath,
    memberId,
    env.ASSOCIATION_MEMBERS_MEDICS_FOLDER,
    medicFileName,
  );
