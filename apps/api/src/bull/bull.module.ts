import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'receipt-queue',
    }),
  ],
  exports: [BullModule],
})
export class BullQueueModule {}