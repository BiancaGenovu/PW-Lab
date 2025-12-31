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

  // GET: Listează timpii
  getCircuitTimes(circuitId: number): Observable<TimeModel[]> {
    return this.http.get<TimeModel[]>(`${this.baseApiUrl}/${circuitId}/times`);
  }

  // POST: Adaugă timp nou
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

  // PUT: Modifică un timp existent (FUNCȚIA NOUĂ)
  updateCircuitTime(
    circuitId: number,
    timeId: number,
    payload: { sector1: string | number; sector2: string | number; sector3: string | number }
  ): Observable<TimeModel> {
    return this.http.put<TimeModel>(
      `${this.baseApiUrl}/${circuitId}/times/${timeId}`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  // DELETE: Șterge un timp
  deleteCircuitTime(circuitId: number, timeId: number): Observable<any> {
    return this.http.delete(
      `${this.baseApiUrl}/${circuitId}/times/${timeId}`,
      { headers: this.getHeaders() }
    );
  }
}