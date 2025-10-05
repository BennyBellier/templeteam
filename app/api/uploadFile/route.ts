"use server";

import { storeFileInTmp } from "@/server/fs/files-manipulation";
import logger from "@/server/logger";
import { type NextRequest, NextResponse } from "next/server";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  file: zfd.file(),
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const parsed = schema.safeParse(formData);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Fichier manquant ou invalide." },
        { status: 400 },
      );
    }

    const { file } = parsed.data;
    const tmp_filename = await storeFileInTmp(file);

    return NextResponse.json({ ok: true, data: tmp_filename }, { status: 200 });
  } catch (e) {
    logger.error({
      context: "API",
      endpoint: "UploadFile",
      message: "Error while saving temp file.",
      error: e,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Erreur interne lors de l'enregistrement du fichier.",
      },
      { status: 500 },
    );
  }
}
