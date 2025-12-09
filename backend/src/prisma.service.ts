import { INestApplication, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const url = process.env.DATABASE_URL;

    if (!url) {
      console.log('[PrismaService] DATABASE_URL not set — using default Prisma client');
      super();             // 调用无 adapter 的版本
    } else {
      console.log('[PrismaService] DATABASE_URL found — using PrismaPg adapter:', url);
      const adapter = new PrismaPg({ connectionString: url });
      super({ adapter });
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    const client: any = this as any;
    if (typeof client.$on === 'function') {
      client.$on('beforeExit', async () => {
        await app.close();
      });
    }
  }
}