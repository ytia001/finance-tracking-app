import 'multer';
import { Controller, Post, Get, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptsService } from './receipts.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('v1/receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.receiptsService.uploadReceipt(file);
  }

  @Get(':jobId/status')
  @Public()
  async getStatus(@Param('jobId') jobId: string) {
    return this.receiptsService.getStatus(jobId);
  }
}
