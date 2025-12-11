import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
        const useTls = url.startsWith('rediss://');
        const client = createClient({
          url,
          socket: useTls
            ? {
                tls: true,
                rejectUnauthorized: false, // allow Heroku/managed Redis self-signed certs
              }
            : undefined,
        });
        client.on('error', (err) => {
          // eslint-disable-next-line no-console
          console.error('Redis connection error', err);
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}

