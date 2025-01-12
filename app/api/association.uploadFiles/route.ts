"use server";

import fs from "fs";
import { createHash } from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const loggerMetadata = { type: "api", endpoint: "association.UploadFile" };

export async function POST(req: NextRequest) {
  try {
    // check if cookies exist
    if (!req.headers.get("cookie")) {
      return NextResponse.json({ status: "no cookie?" }, { status: 403 });
    }

    // check existing crsf token
    const rawCookieString = req.headers.get("cookie") ?? ""; // raw cookie string, possibly multiple cookies
    const rawCookiesArr = rawCookieString.split(";");

    let parsedCsrfTokenAndHash: string | null = null;

    for (const rawCookie of rawCookiesArr) {
      // loop through cookies to find CSRF from next-auth
      const cookieArr = rawCookie.split("=");
      if (cookieArr[0]?.trim() === "next-auth.csrf-token") {
        parsedCsrfTokenAndHash = cookieArr[1] ?? "";
        break;
      }
    }

    if (!parsedCsrfTokenAndHash) {
      return NextResponse.json({ status: "missing crsf" }, { status: 403 }); // can't find next-auth CSRF in cookies
    }
    // delimiter could be either a '|' or a '%7C'
    const tokenHashDelimiter =
      parsedCsrfTokenAndHash.indexOf("|") !== -1 ? "|" : "%7C";

    const [requestToken, requestHash] =
      parsedCsrfTokenAndHash.split(tokenHashDelimiter);

    const secret = process.env.SECRET;

    // compute the valid hash
    const validHash = createHash("sha256")
      .update(`${requestToken}${secret}`)
      .digest("hex");

    if (requestHash !== validHash) {
      return NextResponse.json(
        { error: { status: "bad crsf token" } },
        { status: 403 },
      ); // bad crsf token hash
    }

    // extract formData from body request
    const formData = await req.formData();

    // extract files from formData
    const photo = formData.get("photo") as File;
    const document = formData.get("document") as File;

    if (
      !photo ||
      !(photo instanceof File) ||
      !document ||
      !(document instanceof File)
    ) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Les fichiers requis ne sont pas présents.",
          details: {
            photo: !photo
              ? "La photo est manquant."
              : !(photo instanceof File)
                ? "La photo n'est pas un type fichier."
                : null,
            document: !document
              ? "Le certificat médicale est manquant."
              : !(photo instanceof File)
                ? "Le certificat médicale n'est pas un fichier."
                : null,
          },
        },
        { status: 400 },
      );
    }

    // extract filenames
    const photoFilename = formData.get("photoFilename");
    const documentFilename = formData.get("documentFilename");

    if (!photoFilename || !documentFilename) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Les noms des fichiers n'ont pas pu être généré.",
          details: {
            photo: photoFilename ? null : "La génération à échoué.",
            document: documentFilename ? null : "La génération à échoué.",
          },
        },
        { status: 400 },
      );
    }

    // Save file on server
    const saveFile = async (file: File, folder: string) => {
      const fileName = `${uuidv4()}_${Date.now()}${path.extname(file.name)}`;
      const filePath = path.join(
        "./public/association/members",
        folder,
        fileName,
      );
      const buffer = Buffer.from(await file.arrayBuffer());

      // Créer le répertoire s'il n'existe pas
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, buffer);
      return fileName;
    };

    const photoPath = await saveFile(photo, "photo");
    const documentPath = await saveFile(document, "certificat_medical");

    console.info(
      loggerMetadata && {
        message: `Successfully saved ${photoPath} and ${documentPath}`,
      },
    );

    // Success reponse
    return NextResponse.json(
      {
        status: "success",
        message: "Les fichiers ont été téléchargés avec succès.",
        filePaths: {
          photo: photoPath,
          document: documentPath,
        },
      },
      { status: 201 },
    );
  } catch (e) {
    console.error(loggerMetadata && e);

    // Return error
    return NextResponse.json(
      {
        status: "error",
        message: "Erreur interne lors du téléchargement des fichiers.",
        details: e,
      },
      { status: 500 },
    );
  }
}
