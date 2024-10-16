"use server";

import fs from "fs";
import rateLimite from "next-rate-limit";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const limiter = rateLimite({
  interval: 60 * 100,
  uniqueTokenPerInterval: 500,
});

const loggerMetadata = { type: "api", endpoint: "association.UploadFile" };

export async function POST(req: NextRequest) {
  try {
    limiter.checkNext(req, 5);
  } catch (e) {
    console.error(loggerMetadata && e);

    return NextResponse.json(
      { status: "fail", message: "Rate limit exceeded", details: e },
      { status: 429 },
    );
  }

  try {
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
