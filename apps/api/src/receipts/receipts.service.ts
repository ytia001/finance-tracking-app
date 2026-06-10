import 'multer';
import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TabscannerService } from '../tabscanner/tabscanner.service';
import { DrizzleDB, DRIZZLE } from '../db/db.module';
import { receiptJobs } from '../db/schema/receipts.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ReceiptsService {
  constructor(
    private readonly tabscannerService: TabscannerService,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    @InjectQueue('receipt-queue') private readonly receiptQueue: Queue
  ) {}

  async uploadReceipt(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const token = await this.tabscannerService.submitImage(file.buffer);

    const [newJob] = await this.db
      .insert(receiptJobs)
      .values({
        tabscannerToken: token,
        status: 'PROCESSING'
      })
      .returning();

    await this.receiptQueue.add(
      'process-receipt',
      {
        jobId: newJob.id,
        tabscannerToken: token
      },
      {
        attempts: 20,
        backoff: {
          type: 'fixed',
          delay: 5000
        }
      }
    );

    return { jobId: newJob.id };
  }

  async getStatus(jobId: string) {
    const job = await this.db.query.receiptJobs.findFirst({
      where: eq(receiptJobs.id, jobId)
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      jobId: job.id,
      status: job.status,
      data: job.parsedData,
      error: job.errorMessage
    };
  }

  async markJobCompleted(jobId: string, parsedData: any) {
    await this.db
      .update(receiptJobs)
      .set({
        status: 'COMPLETED',
        parsedData,
        updatedAt: new Date()
      })
      .where(eq(receiptJobs.id, jobId));
  }

  async markJobFailed(jobId: string, errorMessage: string) {
    await this.db
      .update(receiptJobs)
      .set({
        status: 'FAILED',
        errorMessage,
        updatedAt: new Date()
      })
      .where(eq(receiptJobs.id, jobId));
  }
}
