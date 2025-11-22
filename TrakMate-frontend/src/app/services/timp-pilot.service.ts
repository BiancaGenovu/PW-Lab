import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../shared/environment';
import { Observable } from 'rxjs';
import { TimeModel } from '../shared/timeModel';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TimpPilotService {
  private apiUrl = `${environment.backend_api}/api/timePilot`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getPilotTimes(pilotId: number): Observable<TimeModel[]> {
    return this.http.get<TimeModel[]>(`${this.apiUrl}/${pilotId}`);
  }

  addPilotTime(
    pilotId: number,
    payload: { circuitName: string; country: string; lapTime: string | number }
  ): Observable<TimeModel> {
    return this.http.post<TimeModel>(
      `${this.apiUrl}/${pilotId}/times`, 
      payload,
      { headers: this.getHeaders() }
    );
  }

  deletePilotTime(pilotId: number, timeId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${pilotId}/times/${timeId}`,
      { headers: this.getHeaders() }
    );
  }
}