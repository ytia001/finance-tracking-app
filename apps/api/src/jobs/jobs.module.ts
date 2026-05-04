import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ReceiptProcessor } from './receipt.processor';
import { TabscannerModule } from '../tabscanner/tabscanner.module';
import { ReceiptsModule } from '../receipts/receipts.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'receipt-queue',
    }),
    TabscannerModule,
    ReceiptsModule,
  ],
  providers: [ReceiptProcessor],
  exports: [BullModule],
})
export class JobsModule {}
