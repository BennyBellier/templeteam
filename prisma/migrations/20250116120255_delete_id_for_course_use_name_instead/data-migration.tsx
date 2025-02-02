/* import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const schedules = await tx.schedule.findMany({
      include: { Course: true },
    });
    for (const schedule of schedules) {
      await tx.schedule.update({
        where: { id: schedule.id },
        data: {
         courseId: schedule.Course.name,
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