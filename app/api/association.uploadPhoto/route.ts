"use server";

import { type NextRequest, NextResponse } from "next/server";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { writeMemberPhoto } from "@/server/file-manipulations";
import { prisma } from "@/trpc/server";

const loggerMetadata = { type: "api", endpoint: "association.UploadFile" };

const schema = zfd.formData({
  memberId: zfd.text(z.string().uuid()),
  photo: zfd.file(),
});

export async function POST(req: NextRequest) {
  try {
    const { memberId, photo } = schema.parse(await req.formData());

    if (!photo || !(photo instanceof File)) {
      return NextResponse.json(
        {
          status: "fail",
          message: "Aucune photo fourni.",
        },
        { status: 400 },
      );
    }

    const photoUUID = await writeMemberPhoto(memberId, photo);

    await prisma.association.addMemberPhoto({
      memberId,
      photoFilename: photoUUID,
    });

    console.info(
      loggerMetadata && {
        message: `Successfully saved ${photoUUID}`,
      },
    );

    // Success reponse
    return NextResponse.json(
      {
        status: "success",
        message: "La photo a été enregistré avec succés.",
      },
      { status: 201 },
    );
  } catch (e) {
    console.error(loggerMetadata && e);

    // Return error
    return NextResponse.json(
      {
        status: "error",
        message: "Erreur interne lors de l'enregistrement de la photo.",
        details: e,
      },
      { status: 500 },
    );
  }
}
