import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../shared/environment';
import { UserProfile } from '../shared/profileModel';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = `${environment.backend_api}/api/profile`;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getMyProfile(): Observable<UserProfile> {
    const token = this.auth.getToken();

    if (!token) {
      return throwError(() => new Error('No token in localStorage'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<UserProfile>(`${this.baseUrl}/me`, { headers });
  }
}
