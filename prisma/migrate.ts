/* eslint-disable @typescript-eslint/no-floating-promises */
import { DayOfWeek, PrismaClient } from "@prisma/client";

const oldPrisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_SAVE_URL },
  },
});

const prisma = new PrismaClient();

interface oldMembersType {
  id: string;
  lastname: string;
  firstname: string;
  birthdate: Date;
  gender: string;
  mail: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  picture: string;
  medicalComment: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EmergencyContactType {
  id: string;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  memberId: string;
}

interface OldFileType {
  id: string;
  medicalCertificate: string;
  undersigner: string;
  signature: string;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  membership: string;
}

const main = async () => {
  await prisma.member.deleteMany();
  await prisma.file.deleteMany();
  await prisma.course.deleteMany();
  await prisma.legalGuardian.deleteMany();


  const oldMembers: oldMembersType[] =
    await oldPrisma.$queryRaw`SELECT * FROM public."Member";`;

  const emergencyContacts: EmergencyContactType[] =
    await oldPrisma.$queryRaw`SELECT ec.*, mec."memberId" FROM public."EmergencyContact" ec JOIN public."MemberEmergencyContact" mec on ec.id = mec."emergencyContactId";`;

  const oldFiles: OldFileType[] =
    await oldPrisma.$queryRaw`select mm.id, mc."id" as "medicalCertificate", m."undersigner", m."signature", m."id" as "memberId", mm."createdAt", mm."updatedAt", mm."membership" from public."Member" m join public."MemberMembership" mm on m.id  = mm."memberId" left join public."MedicalCertificate" mc on mc."memberId" = m."id";`;

  for (const member of oldMembers) {
    await prisma.member.create({
      data: {
        id: member.id,
        firstname: member.firstname,
        lastname: member.lastname,
        birthdate: member.birthdate,
        gender: member.gender,
        mail: member.mail,
        phoneNumber: member.phoneNumber,
        address: member.address,
        city: member.city,
        postalCode: member.postalCode,
        country: member.country,
        photo: member.picture,
        medicalComment: member.medicalComment,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
    });

    console.log(
      `Create member ${member.lastname} ${member.firstname} as ${member.id}`,
    );
  }

  for (const contact of emergencyContacts) {
    if (!(await prisma.legalGuardian.findUnique({ where: { id: contact.id }})))
    prisma.legalGuardian.create({
      data: {
        id: contact.id,
        lastname: contact.name.split(" ")[0] ?? "",
        firstname: contact.name.split(" ")[1] ?? "",
        phone: contact.phone,
        mail: "",
        members: {
          connect: {
            id: contact.memberId,
          },
        },
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      },
    });

    console.log(
      `Create emergency contact ${contact.name.split(" ")[0] ?? ""} ${contact.name.split(" ")[1] ?? ""} as ${contact.id}for member ${contact.memberId}`,
    );
  }

  const TempleRun = await prisma.course.create({
    data: {
      name: "Temple Run",
      description: "",
      schedule: {
        create: {
          dayOfWeek: DayOfWeek.Saturday,
          startHour: new Date("1970-01-01T17:00:00Z"),
          endHour: new Date("1970-01-01T18:30:00Z"),
        },
      },
    },
  });

  const TempleGymJunior = await prisma.course.create({
    data: {
      name: "Temple Gym Junior",
      description: "",
      schedule: {
        create: {
          dayOfWeek: DayOfWeek.Saturday,
          startHour: new Date("1970-01-01T19:00:00Z"),
          endHour: new Date("1970-01-01T20:15:00Z"),
        },
      },
    },
  });

  const TempleGym = await prisma.course.create({
    data: {
      name: "Temple Gym",
      description: "",
      schedule: {
        create: {
          dayOfWeek: DayOfWeek.Saturday,
          startHour: new Date("1970-01-01T20:15:00Z"),
          endHour: new Date("1970-01-01T21:45:00Z"),
        },
      },
    },
  });

  for (const oldFile of oldFiles) {
    if (!(await prisma.file.findUnique({ where: { id: oldFile.id } }))) {
      await prisma.file.create({
        data: {
          id: oldFile.id,
          year: new Date("2024-09-01"),
          medicalCertificate: oldFile.medicalCertificate ?? "",
          undersigner: oldFile.undersigner,
          signature: oldFile.signature,
          createdAt: oldFile.createdAt,
          updatedAt: oldFile.updatedAt,
          memberId: oldFile.memberId,
        },
      });

      console.log(`Create file ${oldFile.id} for member ${oldFile.memberId}`)
    }

    switch (oldFile.membership) {
      case "templeRun":
        await prisma.file.update({
          where: {
            id: oldFile.id,
          },
          data: {
            courses: {
              connect: {
                id: TempleRun.id,
              },
            },
          }
        });
        console.log(`Add file ${oldFile.id} to templeRun course`);
        break;
      case "templeGymJunior":
        await prisma.file.update({
          where: {
            id: oldFile.id,
          },
          data: {
            courses: {
              connect: {
                id: TempleGymJunior.id,
              },
            },
          },
        });
        console.log(`Add file ${oldFile.id} to templeGymJunior course`);
        break;

      case "templeGym":
        await prisma.file.update({
          where: {
            id: oldFile.id,
          },
          data: {
            courses: {
              connect: {
                id: TempleGym.id,
              },
            },
          },
        });
        console.log(`Add file ${oldFile.id} to templeGym course`);
        break;
    }
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await oldPrisma.$disconnect();
    await prisma.$disconnect();
  });
