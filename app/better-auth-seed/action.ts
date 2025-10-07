"use server"

import { env } from "@/env.mjs";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { revalidatePath } from "next/cache";

export default async function createAdmin() {
    const email = env.ADMIN_EMAIL;
    const name = env.ADMIN_NAME;
    const password = env.ADMIN_PASSWORD;

    const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("✅ L’administrateur existe déjà :", email);
    return;
  }

  try {
    await auth.api.createUser({
        body: {
            email,
            name,
            password,
            role: "Developer",
        }
    })
    console.log("🎉 Administrateur créé avec succès :", email);
    revalidatePath("/better-auth-seed");
  } catch (error) {
    console.error("❌ Erreur lors de la création de l’administrateur :", error);
  }
}