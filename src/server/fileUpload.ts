"use server";
// import formidable, { type Fields, type Files } from "formidable";
import fs from "fs";
// import { mkdir, stat } from "fs/promises";
// import mime from "mime";
// import type { NextApiRequest } from "next";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import logger from "./logger";

/* export const parseRegisterForm2 = async (req: NextApiRequest) => {
  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), "/public/members"),
    keepExtensions: true,
    filename: (_name, _ext, part) => {
      const uniqueSuffix = uuidv4();
      const extension = mime.getExtension(part.mimetype ?? "");
      return `${uniqueSuffix}.${extension}`;
    },
  });

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    },
  );
};

// export const FormidableError = formidable.errors.FormidableError;

export const parseRegisterForm = async (
  req: NextApiRequest,
): Promise<{ fields: Fields; files: Files }> => {
  const uploadDir = join(
    process.env.ROOT_DIR ?? process.cwd(),
    `/public/member`,
  );

  try {
    // Check if the directory exists, if not, create it
    try {
      await stat(uploadDir);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.code === "ENOENT") {
        await mkdir(uploadDir, { recursive: true });
      } else {
        console.error("Error accessing directory:", e);
        throw e;
      }
    }

    // Setup formidable for file handling
    const form = formidable({
      maxFiles: 1,
      maxFileSize: 1024 * 1024 * 3, // 3MB
      uploadDir,
      filename: (_name, _ext, part) => {
        // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const uniqueSuffix = uuidv4();
        const extension = mime.getExtension(part.mimetype ?? "");
        return `${uniqueSuffix}.${extension}`;
      },
      filter: (part) =>
        part.name === "media" && (part.mimetype?.includes("image") ?? false),
    });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          logger.error("Error parsing form:", err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });
  } catch (error) {
    logger.error("Error during file processing:", error);
    throw error;
  }
}; */

/* export const saveFile = async (
  file: File,
  location: string,
  generateName = true,
): Promise<string> => {
  const uploadDir = path.join(process.cwd(), "public", location);

  // Create the uploads directory if it doesn't exist
  fs.mkdir(uploadDir, { recursive: true }, (err) => {
    logger.fs.error(err);
  });

  const newFilename = `${uuidv4()}.${file.type}`;
  const filePath = path.join(uploadDir, generateName ? newFilename : file.name);

  // Duration execution start profiler.
  const profiler = logger.fs.startTimer();

  // Read the file content and write it to the uploads directory
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      profiler.done({ level: "error", message: err });
    } else {
      profiler.done({
        message: `${generateName ? file.name + " -> " + newFilename : file.name} saved at ${uploadDir}.`,
      });
    }
  });



  return path.join(uploadDir, newFilename);
};
 */