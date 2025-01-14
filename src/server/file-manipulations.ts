import "server-only";

import * as fs from 'fs';
import * as path from 'path';
import logger from "@/server/logger";
import { env } from "@/env.mjs";
import getConfig from 'next/config'

export function serverPath(...paths: string): string {
  return path.join(getConfig().serverRuntimeConfig.PROJECT_ROOT, ...paths);
}

/**
 * Create a directory with optional subfolders.
 * @param name - Name of the directory to create.
 * @param recursive - If true, creates parent folder if necessary.
 */
export function mkdir(path: string, recursive: boolean): void {
    const serverPath = serverPath(path);
    if (!fs.existsSync(serverPath)) {
        fs.mkdirSync(serverPath, { recursive });
        logger.info(`Directory created: ${serverPath}`);
    } else {
        logger.info(`Directory already exists: ${serverPath}`);
    }
}

/**
 * Remove a directory with optional subfolders.
 * @param name - Name of the directory to remove.
 * @param recursive - If true, removes subfolders recursively.
 */
export function rmdir(path: string, recursive: boolean): void {
    const serverPath = serverPath(path);
    if (fs.existsSync(serverPath)) {
        if (recursive) {
            fs.rmSync(serverPath, { recursive: true, force: true });
            logger.info(`Directory and its contents removed: ${serverPath}`);
        } else {
            fs.rmdirSync(serverPath);
            logger.info(`Directory removed: ${serverPath}`);
        }
    } else {
        logger.info(`Directory does not exist: ${serverPath}`);
    }
}

/**
 * ASSOCIATION FILE MANIPULATIONS
 */
export const associationPath = path.join("public", env.STATIC_FOLDER, env.ASSOCIATION_FOLDER);
export const membersPath = path.join(associationPath, env.env.ASSOCIATION_MEMBERS_FOLDER);

export function existsMemberDirectory(id: string): boolean {
    const memberPath = serverPath(membersPath, id)
    return fs.existsSync(memberPath);
}

/**
 * Generate the directory for members with subfolders.
 * @param id - id of the member in table Member
 */
export function generateMemberFolder(id: string): void {
    if (!existsMemberDirectory(id)) {
        const memberPath = serverPath(membersPath, id);

        mkdir(path.join(memberPath, env.ASSOCIATION_MEMBERS_PHOTOS_FOLDER), true);
        mkdir(path.join(memberPath, env.ASSOCIATION_MEMBERS_MEDICS_FOLDER), true);
        mkdir(path.join(memberPath, env.ASSOCIATION_MEMBERS_FILES_FOLDER), true);
        logger.info(`Directories created for member ${id}`);
    }
}

/**
 * 
 */
export function writeMemberPhoto(id: string, file: File): string {
    // Check and generate if member folder does not exist
    generateMemberFolder(id);

    // Get members/{id}/photo folder path
    const memberPhotoPath = serverPath(membersPath, id, env.ASSOCIATION_MEMBERS_PHOTOS_FOLDER);
    
    // Generate filename and file path for the photo
    const filename = `${uuidv4()}_${Date.now()}${path.extname(file.name)}`;
    const filePath = path.join(memberPhotoPath, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return filename;
}