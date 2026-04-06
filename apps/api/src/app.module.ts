import { Module } from '@nestjs/common';
import { DrizzleModule } from './db/db.module';
import { EntriesModule } from './entries/entries.module';

@Module({
  imports: [DrizzleModule, EntriesModule]
})
export class AppModule {}
