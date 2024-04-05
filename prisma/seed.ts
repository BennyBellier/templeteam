/* eslint-disable @typescript-eslint/no-floating-promises */
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
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
  await prisma.user.deleteMany();
  await prisma.blogPosts.deleteMany();
  await prisma.teamMembers.deleteMany();
  await prisma.teamMembersVideo.deleteMany();
  await prisma.teamMembersSkill.deleteMany();

  for (let i = 0; i < 10; i++) {
    const hashed = await hash(faker.internet.password(), 12);
    await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: hashed,
      },
    });
  }

  for (let i = 0; i < 20; i++) {
    await prisma.blogPosts.create({
      data: {
        title: faker.lorem.sentence(),
        thumbnail: faker.system.filePath(),
        published:
          faker.number.float() > 0.8 ? faker.date.past() : faker.date.future(),
        type: faker.helpers.arrayElement(["Article", "Event", "Information"]),
        description: faker.lorem.paragraph(),
        readTime: faker.helpers.rangeToNumber({ min: 1, max: 8 }),
        extraLink: faker.helpers.maybe(faker.internet.url, {
          probability: 0.5,
        }),
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
    console.info("Database seed with member: " + member.name);
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  });
