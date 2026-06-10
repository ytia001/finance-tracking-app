import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';
import { ReceiptProcessor } from './receipt.processor';
import { TabscannerModule } from '../tabscanner/tabscanner.module';
import { BullQueueModule } from '../bull/bull.module';
import { DrizzleModule } from '../db/db.module';

@Module({
  controllers: [ReceiptsController],
  providers: [ReceiptsService, ReceiptProcessor],
  imports: [TabscannerModule, BullQueueModule, DrizzleModule],
})
export class ReceiptsModule {}
