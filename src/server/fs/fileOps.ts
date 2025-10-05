import "server-only";

import logger from "@/server/logger";
import * as fs from "fs";
import * as path from "path";

export function serverPath(...paths: string[]): string {
  return path.join(process.cwd(), ...paths);
}

/**
 * Create a directory with optional subfolders.
 * @param name - Name of the directory to create.
 * @param recursive - If true, creates parent folder if necessary.
 */
export function mkdir(path: string, recursive: boolean): void {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive });

    logger.info({
      context: "FileManipulation",
      requestPath: "mkdir",
      path,
      recursive,
      message: `Directory created.`,
    });
  } else {
    logger.warn({
      context: "FileManipulation",
      requestPath: "mkdir",
      path,
      recursive,
      message: `Directory already exist.`,
    });
  }
}

/**
 * Remove a directory with optional subfolders.
 * @param name - Name of the directory to remove.
 * @param recursive - If true, removes subfolders recursively.
 */
export function rmdir(path: string, recursive: boolean): void {
  if (fs.existsSync(path)) {
    if (recursive) {
      fs.rmSync(path, { recursive: true, force: true });
      logger.info({
        context: "FileManipulation",
        requestPath: "rmdir",
        path,
        recursive,
        message: `Directory and content deleted.`,
      });
    } else {
      fs.rmdirSync(path);

      logger.info({
        context: "FileManipulation",
        requestPath: "rmdir",
        path,
        recursive,
        message: `Directory deleted.`,
      });
    }
  } else {
    logger.warn({
      context: "FileManipulation",
      procedure: "rmdir",
      path,
      recursive,
      message: `Directory does not exist`,
    });
  }
}

export function mv(src: string, dest: string): void {
  fs.rename(src, dest, function (err) {
    if (err) throw err;
    logger.debug({
      context: "FileManipulation",
      requestPath: "mv",
      src,
      dest,
      message: "File successfully moved",
    });
  });
}

export function rm(path: string) {
  fs.unlink(path, function (err) {
    if (err) throw err;
    logger.debug({
      context: "FileManipulation",
      requestPath: "rm",
      file: path,
      message: "File successfully deleted",
    });
  });
}

export function folderExist(path: fs.PathLike): boolean {
  return fs.existsSync(path);
}
