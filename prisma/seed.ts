import { Gender, Role } from "@prisma/client";
/* eslint-disable @typescript-eslint/no-floating-promises */
import { env } from "@/env.mjs";
import { faker } from "@faker-js/faker";
import { BlogCategory, PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const references = [
  {
    name: "pays voironnais basket club",
    img: "pvbc.png",
    href: "pvbc.fr",
    alt: "Logo du PVBC",
    categoryId: 1,
  },
  {
    name: "Ville de Voiron",
    img: "ville-de-voiron-social-logo.png",
    href: "voiron.fr",
    alt: "Logo de la ville de Voiron",
    categoryId: 1,
  },
  {
    name: "Outsider",
    img: null,
    href: null,
    alt: "Outsider",
    categoryId: 1,
  },
];

const referencesCategory = [
  {
    id: 1,
    name: "Loisir & Tourisme",
  },
];

const Members = [
  {
    name: "Romain Castillo",
    nickname: "Mowgli",
    labels: [
      { label: "Accro", percent: 90 },
      { label: "QI", percent: 30 },
      { label: "Biceps", percent: 99 },
    ],
  },
  {
    name: "Julien Daubord",
    nickname: "Coach",
    labels: [
      { label: "État", percent: 40 },
      { label: "Accro", percent: 75 },
      { label: "Ponctualité", percent: 5 },
    ],
  },
  {
    name: "Hugo Rival",
    nickname: "",
    labels: [
      { label: "Breakdance", percent: 65 },
      { label: "Parkour", percent: 77 },
      { label: "Calvitie", percent: 15 },
    ],
  },
  {
    name: "Louis Berchiatti",
    nickname: "Bboychipper",
    labels: [
      { label: "Breakdance", percent: 76 },
      { label: "", percent: 0 },
      { label: "", percent: 0 },
    ],
  },
  {
    name: "Benjamin Bellier",
    nickname: "Benny",
    videos: ["/video/team/Benny.mov", "/video/team/Benny.webm"],
    image: { path: "/img/team/Benjamin.jpg", alt: "Benny" },
    labels: [
      { label: "Cheville", percent: 30 },
      { label: "Vidéaste", percent: 75 },
      { label: "Accro", percent: 50 },
    ],
  },
];

const main = async () => {
  await prisma.references.deleteMany();
  await prisma.referenceCategory.deleteMany();
  await prisma.blogPosts.deleteMany();
  await prisma.teamMembers.deleteMany();
  await prisma.teamMembersVideo.deleteMany();
  await prisma.teamMembersSkill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.member.deleteMany();
  await prisma.legalGuardian.deleteMany();
  await prisma.file.deleteMany();
  await prisma.course.deleteMany();
  await prisma.schedule.deleteMany();

  process.stdout.write("Delete old data OK.\n");

  const user = await prisma.user.create({
    data: {
      name: "admin",
      email: "contact@templeteam.fr",
      password: await hash("admin", 10),
      role: Role.Developer,
    },
  });

  process.stdout.write("Add dev user for test at id " + user.id + ".\n");

  await prisma.course.create({
    data: {
      name: "Temple Run",
      description: "",
      schedule: {
        create: {
          dayOfWeek: "Saturday",
          startHour: new Date("1970-01-01T17:00:00Z"),
          endHour: new Date("1970-01-01T18:30:00Z"),
        },
      },
    },
  });

  await prisma.course.create({
    data: {
      name: "Temple Gym Junior",
      description: "",
      schedule: {
        create: {
          dayOfWeek: "Saturday",
          startHour: new Date("1970-01-01T19:00:00Z"),
          endHour: new Date("1970-01-01T20:15:00Z"),
        },
      },
    },
  });

  await prisma.course.create({
    data: {
      name: "Temple Gym",
      description: "",
      schedule: {
        create: {
          dayOfWeek: "Saturday",
          startHour: new Date("1970-01-01T20:15:00Z"),
          endHour: new Date("1970-01-01T21:45:00Z"),
        },
      },
    },
  });

  process.stdout.write("Courses generation OK.\n");

  let progress = 0;
  for (let i = 0; i < 50; i++) {
    const course: string = faker.helpers.arrayElement([
      "Temple Gym",
      "Temple Gym Junior",
      "Temple Run",
    ]);
    const { id: memberId } = await prisma.member.create({
      data: {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        birthdate: faker.date.birthdate(),
        gender: faker.helpers.arrayElement([Gender.Male, Gender.Female]),
        mail: faker.internet.email(),
        phone: faker.helpers.fromRegExp("+33[6-7][0-9]{8}"),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        photo: faker.system.commonFileName("jpg"),
        medicalComment: faker.lorem.paragraph(),
        legalGuardians: {
          create: {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            phone: faker.helpers.fromRegExp("+33[6-7][0-9]{8}"),
            mail: faker.internet.email(),
          },
        },
        files: {
          create: {
            year: new Date("2024-09-01"),
            medicalCertificate: faker.system.commonFileName("jpg"),
            undersigner: faker.person.fullName(),
            signature: "signature.png",
            courses: {
              connect: {
                name: course,
              },
            },
          },
        },
      },
    });

    for (let j = 0; j < faker.helpers.rangeToNumber({ min: 0, max: 1 }); j++) {
      const { id: legalGuardians } = await prisma.legalGuardian.create({
        data: {
          lastname: faker.person.lastName(),
          firstname: faker.person.firstName(),
          phone: faker.helpers.fromRegExp("+33[6-7][0-9]{8}"),
          mail: faker.internet.email(),
        },
      });

      await prisma.member.update({
        where: {
          id: memberId,
        },
        data: {
          legalGuardians: {
            connect: {
              id: legalGuardians,
            },
          },
        },
      });
    }
    progress = Math.round((i / 50) * 100);
    process.stdout.write(
      `\rProgress member generation: [${"#".repeat(progress / 10)}${" ".repeat(10 - progress / 10)}] ${progress}%`,
    );
  }
  process.stdout.write(
    `\rProgress member generation: [${"#".repeat(10)}}] 100%`,
  );

  process.stdout.write("\n");

  for (let i = 0; i < 20; i++) {
    await prisma.blogPosts.create({
      data: {
        title: faker.lorem.sentence(),
        thumbnail: faker.system.filePath(),
        published:
          faker.number.float() > 0.5 ? faker.date.past() : faker.date.future(),
        category: faker.helpers.arrayElement([
          BlogCategory.ARTICLE,
          BlogCategory.EVENT,
          BlogCategory.INFORMATION,
        ]),
        description: faker.lorem.paragraph(),
        readTime: faker.helpers.rangeToNumber({ min: 1, max: 8 }),
        /* extraLink: faker.helpers.maybe(faker.internet.url, {
          probability: 0.5,
        }), */
      },
    });
  }

  referencesCategory.map(async (category) => {
    await prisma.referenceCategory.create({ data: category });
  });

  references.map(async (ref) => {
    await prisma.references.create({ data: ref });
  });

  for (const member of Members) {
    const createdMember = await prisma.teamMembers.create({
      data: {
        name: member.name,
        nickname: member.nickname,
        imagePath: member.image?.path,
        imageAlt: member.image?.alt,
      },
    });

    if (member.videos) {
      for (const videoPath of member.videos) {
        await prisma.teamMembersVideo.create({
          data: {
            path: videoPath,
            teamMembersId: createdMember.id,
          },
        });
      }
    }

    if (member.labels) {
      for (const label of member.labels) {
        await prisma.teamMembersSkill.create({
          data: {
            label: label.label,
            percent: label.percent,
            teamMembersId: createdMember.id,
          },
        });
      }
    }
    process.stdout.write("Database seed with member: " + member.name + "\n");
  }
};

if (env.NODE_ENV === "development") {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
