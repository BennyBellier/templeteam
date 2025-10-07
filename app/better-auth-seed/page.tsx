import { Button } from "@/components/ui/button";
import createAdmin from "./action";
import { prisma } from "@/server/db";
import { env } from "@/env.mjs";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    robots: {
      index: false,
      follow: false,
    },
  };

export default async function CreateAdminPage({
    searchParams,
  }: {
    searchParams: Promise<{ key?: string }>;
  }) {
    const { key } = await searchParams;
    const userExist = await prisma.user.findUnique({ where: { email: env.ADMIN_EMAIL } });

    if (key !== env.ADMIN_SEED_KEY) {
        return <p className="text-center mt-10">🚫 Accès refusé</p>;
      }

    if (userExist) {
        redirect("/sign-in");
    }

  return (
    <form
      action={createAdmin}
      className="mx-auto mt-10 flex max-w-sm flex-col gap-4"
    >
      <Button type="submit">Créer l’administrateur</Button>
    </form>
  );
}
