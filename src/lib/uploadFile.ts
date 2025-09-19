import z from "zod";
import { type Result, resultSchema } from "@/lib/utils";

const UploadFileResultSchema = resultSchema(z.string());

export async function uploadFile(file: File): Promise<Result<string>> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/uploadFile", {
    method: "POST",
    body: formData,
  });

  const parsed = UploadFileResultSchema.safeParse(await response.json());

  if (!parsed.success) {
    return {
      ok: false,
      error:
        "Erreur interne. Veuillez réessayer ou contacter le support si le problème persiste.",
    };
  }

  return parsed.data;
}
