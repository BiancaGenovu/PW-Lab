import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../shared/environment';
import { Observable } from 'rxjs';
import { TimeModel } from '../shared/timeModel';

@Injectable({ providedIn: 'root' })
export class TimpPilotService {
  private apiUrl = `${environment.backend_api}/api/timePilot`;

  constructor(private http: HttpClient) {}

  getPilotTimes(pilotId: number): Observable<TimeModel[]> {
    return this.http.get<TimeModel[]>(`${this.apiUrl}/${pilotId}`);
  }

  addPilotTime(
    pilotId: number,
    payload: { circuitName: string; country: string; lapTime: string | number }
  ): Observable<TimeModel> {
    return this.http.post<TimeModel>(`${this.apiUrl}/${pilotId}/times`, payload);
  }
}
