
  import 'dotenv/config';
  import * as bcrypt from 'bcrypt';
  import { PrismaMariaDb } from '@prisma/adapter-mariadb';
  import { PrismaClient } from '../generated/prisma/client';

  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const prisma = new PrismaClient({ adapter });

  async function main() {
    const email = 'marianne@gmail.com';
    const plainPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!plainPassword) {
      throw new Error('SEED_ADMIN_PASSWORD is not configured.');
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        firstName: 'Marianne',
        lastName: 'Mendoza',
        role: 'IT_TECHNICIAN',
        isActive: true,
        password: hashedPassword,
      },
      create: {
        email,
        firstName: 'Marianne',
        lastName: 'Mendoza',
        role: 'IT_TECHNICIAN',
        isActive: true,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    console.log('Database successfully seeded!', user);
  }

  main()
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
