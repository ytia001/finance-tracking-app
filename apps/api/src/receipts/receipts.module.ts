import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { TabscannerModule } from '../tabscanner/tabscanner.module';
import { JobsModule } from '../jobs/jobs.module';
import { DrizzleModule } from '../db/db.module';

@Module({
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
  imports: [TabscannerModule, JobsModule, DrizzleModule],
})
export class ReceiptsModule {}
