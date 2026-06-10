import { Module } from '@nestjs/common';
import { ReceiptsModule } from '../receipts/receipts.module';
import { BullQueueModule } from '../bull/bull.module';

@Module({
  imports: [
    ReceiptsModule,
    BullQueueModule,
  ],
  exports: [BullQueueModule],
})
export class JobsModule {}
