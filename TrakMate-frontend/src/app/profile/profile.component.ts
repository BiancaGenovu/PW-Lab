import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../shared/profileModel';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  loading = false;
  error: string | null = null;
  profile: UserProfile | null = null;

  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    // dacă nu e logat -> direct la login
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.error = null;
    this.profile = null;

    this.profileService.getMyProfile().subscribe({
      next: (user: UserProfile) => {
        this.profile = user;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Profil error', err);
        this.loading = false;

        // dacă token-ul e invalid / expirat -> scoatem userul și mergem la login
        if (err?.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        } else {
          this.error = 'Nu am putut încărca profilul. Încearcă din nou.';
        }
      },
    });
  }

  // folosit de butonul "Mergi la login" din HTML
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // folosit de butonul "Logout"
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
