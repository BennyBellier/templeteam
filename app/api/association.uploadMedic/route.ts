"use server";

import { writeMemberFileMedic } from "@/server/file/file-manipulations";
import logger from "@/server/logger";
import { prisma } from "@/trpc/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { zfd } from "zod-form-data";

const loggerMetadata = { type: "api", endpoint: "association.UploadFile" };

const schema = zfd.formData({
  memberId: zfd.text(z.string().uuid()),
  fileId: zfd.text(z.string().uuid()),
  medic: zfd.file(),
});

export async function POST(req: NextRequest) {
  try {
    const { memberId, fileId, medic } = schema.parse(await req.formData());

    if (!medic || !(medic instanceof File)) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Aucun certificat médicale fourni.",
        },
        { status: 400 },
      );
    }

    const medicUUID = await writeMemberFileMedic(memberId, medic);

    await prisma.association.registration.addFileMedic({
      fileId,
      medicFilename: medicUUID,
    });

    logger.info({
      context: "API",
      requestPath: "association.uploadMedic",
      message: `Successfuly saved medic for file ${fileId}.`,
      data: { fileId, medicUUID, medic },
    });

    // Success reponse
    return NextResponse.json(
      {
        status: "success",
        message: "Le certificat médicale a été enregistré avec succés.",
      },
      { status: 201 },
    );
  } catch (e) {
    console.error(loggerMetadata && e);

    // Return error
    return NextResponse.json(
      {
        status: "error",
        message:
          "Erreur interne lors de l'enregistrement du certificat médical.",
        details: e,
      },
      { status: 500 },
    );
  }
}
