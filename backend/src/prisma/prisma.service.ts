
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // console.log({
    //   workingDirectory: process.cwd(),
    //   dbName: JSON.stringify(process.env.DB_NAME),
    //   dbNameExists: Object.hasOwn(process.env, 'DB_NAME'),
    // });
    
    // console.log({
    //   host: process.env.DB_HOST,
    //   user: process.env.DB_USER,
    //   database: process.env.DB_NAME,
    //   databaseLoaded: Boolean(process.env.DB_NAME),
    // });

    const mariaDbConfig = {
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      allowPublicKeyRetrieval: true,
    };

    const adapter = new PrismaMariaDb(mariaDbConfig);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  
}
