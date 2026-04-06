import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataEntryRequest } from '../../features/main/entry-modal/entry-modal-control-service/entry-modal-control.service';
import { DataEntry } from '../../models/DataEntry';

@Injectable({ providedIn: 'root' })
export class MainService {
  private http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:3000/entries';

  /** CREATE — POST /entries */
  create(entry: DataEntryRequest): Observable<DataEntry> {
    return this.http.post<DataEntry>(this.baseUrl, entry);
  }

  /** READ (list) — GET /entries */
  getAll(): Observable<DataEntry[]> {
    return this.http.get<DataEntry[]>(this.baseUrl);
  }

  /** UPDATE — PUT /entries/:id */
  update(id: number, entry: Partial<DataEntryRequest>): Observable<DataEntry> {
    return this.http.put<DataEntry>(`${this.baseUrl}/${id}`, entry);
  }

  /** DELETE — DELETE /entries/:id */
  delete(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${id}`);
  }
}
