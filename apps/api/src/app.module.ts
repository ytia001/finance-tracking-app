import { Module } from '@nestjs/common';
import { DrizzleModule } from './db/db.module';
import { EntriesModule } from './entries/entries.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DrizzleModule, EntriesModule, AuthModule]
})
export class AppModule {}
