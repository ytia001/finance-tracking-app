import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Injection token used across the app
export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        const client = postgres(process.env.DATABASE_URL!);
        return drizzle(client, { schema });
      }
    }
  ],
  exports: [DRIZZLE]
})
export class DrizzleModule {}
