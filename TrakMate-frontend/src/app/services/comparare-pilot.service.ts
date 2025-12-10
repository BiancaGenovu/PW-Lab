import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../shared/environment';
import { PilotComparisonResponse } from '../shared/compararePilotModel';

@Injectable({ providedIn: 'root' })
export class CompararePilotService {
  private apiUrl = `${environment.backend_api}/api/comparare-pilot`;

  constructor(private http: HttpClient) {}

  comparePilots(myPilotId: number, rivalPilotId: number, circuitId: number): Observable<PilotComparisonResponse> {
    return this.http.get<PilotComparisonResponse>(
      `${this.apiUrl}/${myPilotId}/${rivalPilotId}/${circuitId}`
    );
  }
}