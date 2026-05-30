import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReceiptJobStatusResponse, ReceiptJobToken } from '../../models/Receipt';

@Injectable({ providedIn: 'root' })
export class ReceiptsService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/v1/receipts';

  uploadReceiptForProcessing(file: File): Observable<ReceiptJobToken> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<ReceiptJobToken>(this.apiUrl, formData);
  }

  /**
   * Get the receipt status and OCR parsed data.
   * GET /api/v1/receipts/:jobId/status
   */
  getStatus(jobId: string): Observable<ReceiptJobStatusResponse> {
    return this.http.get<ReceiptJobStatusResponse>(`${this.apiUrl}/${jobId}/status`);
  }
}
