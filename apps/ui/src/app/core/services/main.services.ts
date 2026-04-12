import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataEntryRequest } from '../../features/main/entry-modal/entry-modal-control-service/entry-modal-control.service';
import { DataEntry } from '../../models/DataEntry';
import { SuccessResponse } from '../../models/response';

@Injectable({ providedIn: 'root' })
export class MainService {
  private http = inject(HttpClient);

  private readonly apiUrl = '/entries';

  /** CREATE — POST /entries */
  create(entry: DataEntryRequest): Observable<DataEntry> {
    return this.http.post<DataEntry>(this.apiUrl, entry);
  }

  /** READ (list) — GET /entries */
  getAll(): Observable<DataEntry[]> {
    return this.http.get<DataEntry[]>(this.apiUrl);
  }

  /** UPDATE — PUT /entries/:id */
  update(id: number, entry: Partial<DataEntryRequest>): Observable<DataEntry> {
    return this.http.put<DataEntry>(`${this.apiUrl}/${id}`, entry);
  }

  /** DELETE — DELETE /entries/:id */
  delete(id: number): Observable<SuccessResponse> {
    return this.http.delete<SuccessResponse>(`${this.apiUrl}/${id}`);
  }
}
