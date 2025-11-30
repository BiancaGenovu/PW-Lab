import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../shared/environment';
import { Observable } from 'rxjs';
import { TimeModel } from '../shared/timeModel';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TimpCircuitService {
  private baseApiUrl = `${environment.backend_api}/api/circuites`;

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

  getCircuitTimes(circuitId: number): Observable<TimeModel[]> {
    return this.http.get<TimeModel[]>(`${this.baseApiUrl}/${circuitId}/times`);
  }

  addCircuitTime(
    circuitId: number,
    payload: { sector1: string | number; sector2: string | number; sector3: string | number }
  ): Observable<TimeModel> {
    return this.http.post<TimeModel>(
      `${this.baseApiUrl}/${circuitId}/times`, 
      payload,
      { headers: this.getHeaders() }
    );
  }

  deleteCircuitTime(circuitId: number, timeId: number): Observable<any> {
    return this.http.delete(
      `${this.baseApiUrl}/${circuitId}/times/${timeId}`,
      { headers: this.getHeaders() }
    );
  }
}