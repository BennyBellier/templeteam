import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

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

const main = async () => {
  await prisma.references.deleteMany();
  await prisma.referenceCategory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.blogPosts.deleteMany();

  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
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
