import { Prisma } from '@prisma/client';

export const productsData: Prisma.ProductCreateManyInput[] = [
  {
    name: 'Soap',
    price: 100,
    description: 'Good soap',
    categoryId: 1,
  },
  {
    name: 'Shampoo',
    price: 200,
    description: 'Good shampoo',
    categoryId: 2,
  },
  {
    name: 'Conditioner',
    price: 300,
    description: 'Good conditioner',
    categoryId: 3,
  },
  {
    name: 'Body Wash',
    price: 400,
    description: 'Good body wash',
    categoryId: 4,
  },
];
