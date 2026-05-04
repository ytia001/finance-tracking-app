import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const POSTGRES = Symbol('POSTGRES');
export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

@Global()
@Module({
  providers: [
    {
      provide: POSTGRES,
      useFactory: () => postgres(process.env.DATABASE_URL!),
    },
    {
      provide: DRIZZLE,
      inject: [POSTGRES],
      useFactory: (client: ReturnType<typeof postgres>) =>
        drizzle(client, { schema }),
    },
  ],
  exports: [POSTGRES, DRIZZLE],
})
export class DrizzleModule {}
