import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../shared/environment';
import { Top3Response } from '../shared/comparareTop3Model';

@Injectable({ providedIn: 'root' })
export class ComparareTop3Service {
  private apiUrl = `${environment.backend_api}/api/comparare-top3`;

  constructor(private http: HttpClient) {}

  compareWithTop3(pilotId: number, circuitId: number): Observable<Top3Response> {
    return this.http.get<Top3Response>(`${this.apiUrl}/${pilotId}/${circuitId}`);
  }
}