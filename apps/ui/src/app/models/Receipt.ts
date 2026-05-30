export enum JobStatus {
  PROCESSING = 'PROCESSING',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface TabscannerParsedData {
  total?: number | string;
  date?: string;
  establishment?: string;
  [key: string]: any;
}

export interface ReceiptJobToken {
  jobId: string;
}

export interface ReceiptJobStatusResponse extends ReceiptJobToken {
  status: JobStatus;
  data?: TabscannerParsedData;
  error?: string;
}
