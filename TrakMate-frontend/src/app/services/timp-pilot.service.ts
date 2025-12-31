import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../shared/environment';
import { Observable } from 'rxjs';
import { TimeModel } from '../shared/timePilotModel'; // Asigura-te ca importul e corect
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

  // Adaugă această metodă în clasa TimpPilotService
getAllCircuits(): Observable<any[]> {
  // Backend-ul tău are deja ruta asta la /api/circuites
  return this.http.get<any[]>(`${environment.backend_api}/api/circuites`);
}

// Modifică metoda addPilotTime să accepte circuitId
addPilotTime(
  pilotId: number,
  payload: { 
    circuitId: number; // Aici s-a schimbat din name in ID
    // country nu mai e nevoie să fie trimis la backend, el știe deja
    sector1: string | number;
    sector2: string | number;
    sector3: string | number;
  }
): Observable<TimeModel> {
  return this.http.post<TimeModel>(
    `${this.apiUrl}/${pilotId}/times`, 
    payload,
    { headers: this.getHeaders() }
  );
}

  // --- METODA NOUĂ PENTRU UPDATE ---
  updatePilotTime(
    pilotId: number,
    timeId: number,
    payload: {
      circuitName: string;
      country: string;
      sector1: string | number;
      sector2: string | number;
      sector3: string | number;
    }
  ): Observable<TimeModel> {
    return this.http.put<TimeModel>(
      `${this.apiUrl}/${pilotId}/times/${timeId}`,
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