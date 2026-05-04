import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { DrizzleModule } from './db/db.module';
import { EntriesModule } from './entries/entries.module';
import { AuthModule } from './auth/auth.module';
import { ClsModuleSetup } from './common/cls.module';
import { TabscannerModule } from './tabscanner/tabscanner.module';
import { JobsModule } from './jobs/jobs.module';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    ClsModuleSetup,
    DrizzleModule,
    EntriesModule,
    AuthModule,
    TabscannerModule,
    JobsModule,
    ReceiptsModule,
  ],
})
export class AppModule {}
