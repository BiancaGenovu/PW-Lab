import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../shared/environment';
import { Observable } from 'rxjs';
import { circuitesModel } from '../shared/circuitesModel';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CircuitesService {
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

  getCircuites(): Observable<circuitesModel[]> {
    return this.http.get<circuitesModel[]>(this.baseApiUrl);
  }

  addCircuit(payload: { name: string; km: number; country: string }): Observable<circuitesModel> {
    return this.http.post<circuitesModel>(
      this.baseApiUrl,
      payload,
      { headers: this.getHeaders() }
    );
  }

  updateCircuit(circuitId: number, payload: { name: string; km: number; country: string }): Observable<circuitesModel> {
    return this.http.put<circuitesModel>(
      `${this.baseApiUrl}/${circuitId}`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  deleteCircuit(circuitId: number): Observable<any> {
    return this.http.delete(
      `${this.baseApiUrl}/${circuitId}`,
      { headers: this.getHeaders() }
    );
  }
}