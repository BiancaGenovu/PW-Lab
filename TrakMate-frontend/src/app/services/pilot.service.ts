import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../shared/environment';
import { Observable } from 'rxjs';
import { pilotModel } from '../shared/pilotModel';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PilotService {
  private baseApiUrl = `${environment.backend_api}/api/pilot`;

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

  getPilot(): Observable<pilotModel[]> {
    return this.http.get<pilotModel[]>(this.baseApiUrl);
  }

  deletePilot(pilotId: number): Observable<any> {
    return this.http.delete(
      `${this.baseApiUrl}/${pilotId}`,
      { headers: this.getHeaders() }
    );
  }
}