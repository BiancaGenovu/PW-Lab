import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../shared/environment';
import { Observable } from 'rxjs';
import { circuitesModel } from '../shared/circuitesModel';

@Injectable({ providedIn: 'root' })
export class CircuitesService {
  constructor(private http: HttpClient) {}

  getCircuites(): Observable<circuitesModel[]> {
    // dacă backend-ul pornește pe 3000 și rutele sunt /api/circuits
    return this.http.get<circuitesModel[]>(`${environment.backend_api}/api/circuits`);

  }
}
