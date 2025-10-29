import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../shared/environment';
import { Observable } from 'rxjs';
import { pilotModel } from '../shared/pilotModel';

@Injectable({ providedIn: 'root' })
export class PilotService {
  constructor(private http: HttpClient) {}

  getPilot(): Observable<pilotModel[]> {
    // dacă backend-ul pornește pe 3000 și rutele sunt /api/pilot
    return this.http.get<pilotModel[]>(`${environment.backend_api}/api/pilot`);

  }
}
