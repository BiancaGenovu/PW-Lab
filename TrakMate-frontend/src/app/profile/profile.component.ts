import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../shared/profileModel';
import { environment } from '../shared/environment';

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
  
  // NOU: Pentru upload imagine
  selectedFile: File | null = null;
  uploading = false;

  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
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

        if (err?.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        } else {
          this.error = 'Nu am putut încărca profilul. Încearcă din nou.';
        }
      },
    });
  }

  // NOU: Handler pentru selectare fișier
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Verifică că e imagine
      if (!file.type.startsWith('image/')) {
        alert('Te rog selectează o imagine validă!');
        return;
      }
      // Verifică dimensiune (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Imaginea e prea mare! Max 5MB.');
        return;
      }
      this.selectedFile = file;
    }
  }

  // NOU: Upload imagine
  // Upload imagine
uploadImage(): void {
  if (!this.selectedFile || !this.profile) return;

  this.uploading = true;
  this.profileService.uploadProfileImage(this.profile.id, this.selectedFile).subscribe({
    next: (response) => {
      console.log('Upload success:', response);
      this.uploading = false;
      this.selectedFile = null;
      
      // IMPORTANT: Actualizează și localStorage cu noua imagine
      if (response.profileImage) {
        const currentUser = this.auth.getCurrentUser();
        if (currentUser) {
          currentUser.profileImage = response.profileImage;
          this.auth.saveCurrentUser(currentUser);
        }
      }
      
      // Reîncarcă profilul
      this.loadProfile();
    },
    error: (err) => {
      console.error('Upload error:', err);
      this.uploading = false;
      alert(err?.error?.error || 'Nu s-a putut uploada imaginea.');
    }
  });
}

  // NOU: Generează URL complet pentru imagine
  getProfileImageUrl(): string {
    if (this.profile?.profileImage) {
      return `${environment.backend_api}${this.profile.profileImage}`;
    }
    return 'https://via.placeholder.com/150?text=No+Image'; // Placeholder
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}