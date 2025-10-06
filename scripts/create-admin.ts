import { prisma } from "@/server/db";
import bcrypt from "bcrypt";
import { auth } from "@/server/auth"
import { env } from "@/env.mjs";

async function main() {
    const email = env.ADMIN_MAIL;
    const name = env.ADMIN_NAME;
    const password = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
    
    const existing = await prisma.user.findUnique({ where : { email }});
    if (existing) {
        console.log("Admin déjà existant");
        return;
      }
    
      await auth.api.createUser({
        body: {
          email,
          password,
          name,
          role: "Developer",
        },
      });
    
      console.log("✅ Compte admin créé avec succès !");
}

main().then(() => process.exit(0)).catch(e => {
    console.error(e)
    process.exit(1)
})