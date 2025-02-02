/* import { Gender, PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const members = await tx.member.findMany();
    for (const member of members) {
      await tx.member.update({
        where: { id: member.id },
        data: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          genderEnum:
            member.gender === "men"
            ? Gender.Male
            : member.gender === "woman"
            ? Gender.Female
            : Gender.NotSpecified,
        },
      });
    }
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
 */