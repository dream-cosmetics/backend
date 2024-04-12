import { PrismaClient, $Enums } from '@prisma/client';
import { genSalt, hash } from 'bcryptjs';
import { categoriesData } from './categories.seed';
import { productsData } from './products.seed';
const prisma = new PrismaClient();

async function main() {
  const salt = await genSalt();
  const hashedPassword = await hash('12345', salt);

  try {
    await prisma.user.upsert({
      where: { email: 'admin@mail.com' },
      update: {},
      create: {
        email: 'admin@mail.com',
        firstName: 'Admin',
        lastName: 'Admin',
        phone: '1234567890',
        password: hashedPassword,
        status: $Enums.Status.ACTIVE,
        role: $Enums.Role.ADMIN,
      },
    });

    const existingCategories = await prisma.category.count();
    if (existingCategories === 0) {
      await prisma.category.createMany({
        data: categoriesData,
      });
    }

    const existingProducts = await prisma.product.count();
    if (existingProducts === 0) {
      await prisma.product.createMany({
        data: productsData,
      });
    }
  } catch (error) {
    console.debug('Error while seeding', error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
