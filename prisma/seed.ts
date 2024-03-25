import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.category.createMany({
    skipDuplicates: true, // Ensures unique category names
    data: [{name: 'Fruits'}, {name: 'Vegetables'}, {name: 'Baked Goods'}, {name: 'Snacks'}, {name: 'Drinks'}],
  });

  await prisma.product.createMany({
    data: [
      {
        name: 'Apple',
        price: 1.25,
        weight: 100,
        description: 'Fresh and juicy apple',
        ingredients: 'Apple',
        categoryId: 1, // Assign appropriate category ID
      },
      {
        name: 'Banana',
        price: 0.75,
        weight: 150,
        description: 'Rich in potassium',
        ingredients: 'Banana',
        categoryId: 1,
      },
      {
        name: 'Carrot',
        price: 0.5,
        weight: 50,
        description: 'Good source of vitamin A',
        ingredients: 'Carrot',
        categoryId: 2,
      },
      {
        name: 'Chocolate Chip Cookies',
        price: 3.5,
        weight: 200,
        description: 'Delicious homemade cookies',
        ingredients: 'Flour, Sugar, Eggs, Chocolate Chips',
        categoryId: 3,
      },
      {
        name: 'Oatmeal Raisin Cookies',
        price: 4.0,
        weight: 250,
        description: 'Healthy and chewy cookies',
        ingredients: 'Oatmeal, Raisins, Flour, Sugar, Eggs',
        categoryId: 3,
      },
      {
        name: 'Potato Chips',
        price: 2.0,
        weight: 150,
        description: 'Crunchy and salty snack',
        ingredients: 'Potatoes, Oil, Salt',
        categoryId: 4,
      },
      {
        name: 'Orange Juice',
        price: 2.5,
        weight: 1000, // Assuming weight in milliliters
        description: 'Freshly squeezed orange juice',
        ingredients: 'Oranges',
        categoryId: 5,
      },
      {
        name: 'Milk',
        price: 3.0,
        weight: 1000, // Assuming weight in milliliters
        description: 'Whole milk',
        ingredients: 'Milk',
        categoryId: 5,
      },
      {
        name: 'Water',
        price: 1.0,
        weight: 1000,
        description: 'Purified bottled water',
        ingredients: 'Water',
        categoryId: 5,
      },
      {
        name: 'Yogurt',
        price: 2.0,
        weight: 500, // Assuming weight in grams
        description: 'Plain yogurt with fruit',
        ingredients: 'Yogurt, Fruit',
        categoryId: 5, // Can be adjusted to "Dairy" if applicable
      },
    ],
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
