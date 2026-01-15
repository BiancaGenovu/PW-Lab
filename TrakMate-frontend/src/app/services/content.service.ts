import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../shared/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = `${environment.backend_api}/api/stats`;

  constructor(private http: HttpClient) {}

  getHomepageStats(): Observable<{ circuits: number; times: number }> {
    return this.http.get<{ circuits: number; times: number }>(this.apiUrl);
  }
}