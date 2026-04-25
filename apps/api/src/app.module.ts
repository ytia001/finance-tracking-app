import { Module } from '@nestjs/common';
import { DrizzleModule } from './db/db.module';
import { EntriesModule } from './entries/entries.module';
import { AuthModule } from './auth/auth.module';
import { ClsModuleSetup } from './common/cls.module';

@Module({
  imports: [ClsModuleSetup, DrizzleModule, EntriesModule, AuthModule]
})
export class AppModule {}
