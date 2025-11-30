import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../shared/environment';
import { EvolutionResponse } from '../shared/evolutiaMea';

@Injectable({ providedIn: 'root' })
export class EvolutiaMeaService {
  private apiUrl = `${environment.backend_api}/api/evolutia-mea`;

  constructor(private http: HttpClient) {}

  getMyEvolution(pilotId: number, circuitId: number): Observable<EvolutionResponse> {
    return this.http.get<EvolutionResponse>(`${this.apiUrl}/${pilotId}/${circuitId}`);
  }
}