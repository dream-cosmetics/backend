import { Prisma } from '@prisma/client';

export const categoriesData: Prisma.CategoryCreateManyInput[] = [
  {
    name: 'Bathing & Hygiene',
  },
  {
    name: 'Skin Care',
  },
  {
    name: 'Health Care',
  },
  {
    name: 'Beauty Products',
  },
];
