import { Module } from '@nestjs/common';
import { TabscannerService } from './tabscanner.service';

@Module({
  providers: [TabscannerService],
  exports: [TabscannerService],
})
export class TabscannerModule {}
