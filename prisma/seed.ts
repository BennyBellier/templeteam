import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const main = async () => {
  for(let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      }
    })
  }

  for(let i = 0; i < 20; i++) {
    await prisma.blogPosts.create({
      data: {
        title: faker.lorem.sentence(),
        thumbnail: faker.system.filePath(),
        published: faker.number.float() > 0.8 ? faker.date.past() : faker.date.future(),
        type: faker.helpers.arrayElement(['Article', 'Event', 'Information']),
        description: faker.lorem.paragraph(),
        readTime: faker.helpers.rangeToNumber({ min: 1, max: 60 }),
        extraLink: faker.helpers.maybe(faker.internet.url, { probability: 0.5 }),
      },
    })
  }
}

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
