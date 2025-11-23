import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../shared/environment';
import { UserProfile } from '../shared/profileModel';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.backend_api}/api/auth`;
  private TOKEN_KEY = 'token';
  private USER_KEY = 'currentUser';

  constructor(private http: HttpClient) {}

  // ==== API calls ====

  login(email: string, password: string): Observable<{ token: string; user: UserProfile }> {
    return this.http.post<{ token: string; user: UserProfile }>(
      `${this.apiUrl}/login`,
      { email, password }
    );
  }

  register(body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<{ token: string; user: UserProfile }> {
    return this.http.post<{ token: string; user: UserProfile }>(
      `${this.apiUrl}/register`,
      body
    );
  }

  // NOU: Upload imagine profil
  uploadProfileImage(userId: number, formData: FormData): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });

    return this.http.put(
      `${environment.backend_api}/api/pilot/${userId}/upload-image`,
      formData,
      { headers }
    );
  }

  // ==== token management ====

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ==== user management (opțional, folosit la profil/nav bar) ====

  saveCurrentUser(user: UserProfile): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // ==== helpers ====

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // verifică dacă userul e Admin
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Admin';
  }

  logout(): void {
    this.clearToken();
    this.clearCurrentUser();
  }
}