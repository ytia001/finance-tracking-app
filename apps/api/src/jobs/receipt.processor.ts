import { Injectable, Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TabscannerService, TabscannerStatus } from '../tabscanner/tabscanner.service';
import { ReceiptsService } from '../receipts/receipts.service';

interface ReceiptJobData {
  jobId: string;
  tabscannerToken: string;
}

@Processor('receipt-queue')
@Injectable()
export class ReceiptProcessor extends WorkerHost {
  private readonly logger = new Logger(ReceiptProcessor.name);

  constructor(
    private readonly tabscannerService: TabscannerService,
    private readonly receiptsService: ReceiptsService,
  ) {
    super();
  }

  async process(job: Job<ReceiptJobData>) {
    const { jobId, tabscannerToken } = job.data;

    this.logger.log(`Processing job ${jobId} for token ${tabscannerToken}`);

    const response = await this.tabscannerService.getStatus(tabscannerToken);

    if (response.status === TabscannerStatus.PENDING) {
      throw new Error('OCR still pending');
    }

    if (response.status === TabscannerStatus.FAILED) {
      await this.receiptsService.markJobFailed(jobId, response.error || 'OCR processing failed');
      throw new Error(response.error || 'OCR processing failed');
    }

    if (response.status === TabscannerStatus.COMPLETED) {
      await this.receiptsService.markJobCompleted(jobId, response.data);
      return response.data;
    }

    throw new Error('Unknown OCR status');
  }
}