import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../shared/environment';
import { Observable } from 'rxjs';
import { TimeModel } from '../shared/timeModel';

@Injectable({ providedIn: 'root' })
export class TimpCircuitService {
  private baseApiUrl = `${environment.backend_api}/api/circuites`;

  constructor(private http: HttpClient) {}

  getCircuitTimes(circuitId: number): Observable<TimeModel[]> {
    return this.http.get<TimeModel[]>(`${this.baseApiUrl}/${circuitId}/times`);
  }

  addCircuitTime(
    circuitId: number,
    payload: { firstName: string; lastName: string; lapTime: string | number }
  ): Observable<TimeModel> {
    return this.http.post<TimeModel>(`${this.baseApiUrl}/${circuitId}/times`, payload);
  }
}
