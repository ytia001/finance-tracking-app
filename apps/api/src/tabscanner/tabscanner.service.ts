import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';

export enum TabscannerStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface TabscannerSubmitResponse {
  token: string;
}

export interface TabscannerStatusResponse {
  status: TabscannerStatus;
  data?: any;
  error?: string;
}

@Injectable()
export class TabscannerService {
  private readonly logger = new Logger(TabscannerService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('TABSCANNER_API_KEY');
    this.baseUrl = this.configService.getOrThrow<string>('TABSCANNER_BASE_URL');
  }

  async submitImage(imageBuffer: Buffer): Promise<string> {
    this.logger.log('Submitting image to Tabscanner');
    
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename: 'receipt.jpg' });

    try {
      const response = await axios.post<TabscannerSubmitResponse>(
        `${this.baseUrl}/submit`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data.token;
    } catch (error: any) {
      this.logger.error('Failed to submit image to Tabscanner', error.response?.data || error.message);
      throw error;
    }
  }

  async getStatus(token: string): Promise<TabscannerStatusResponse> {
    this.logger.log(`Fetching status from Tabscanner for token: ${token}`);
    
    try {
      const response = await axios.get<TabscannerStatusResponse>(
        `${this.baseUrl}/status/${token}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      this.logger.error('Failed to fetch status from Tabscanner', error.response?.data || error.message);
      throw error;
    }
  }
}
