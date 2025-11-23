import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/auth.service';
import { environment } from '../shared/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  firstName = '';
  lastName = '';

  loading = false;
  error: string | null = null;

  // Pentru imagine
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // Handler pentru selectare fișier
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
      
      // Preview imagine
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Șterge imaginea selectată
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // NOU: Handler pentru eroare imagine (fallback)
  handleImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/120/333333/999999?text=User';
  }

  onSubmit() {
    this.loading = true;
    this.error = null;

    // Validări
    if (!this.email || !this.password || !this.firstName || !this.lastName) {
      this.error = 'Completează toate câmpurile obligatorii!';
      this.loading = false;
      return;
    }

    this.authService.register({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
    }).subscribe({
      next: (res: any) => {
        console.log('Register success:', res);

        // Salvăm token + user
        if (res?.token) {
          this.authService.saveToken(res.token);
        }

        if (res?.user) {
          this.authService.saveCurrentUser(res.user);
        }

        // Dacă avem imagine și user ID, facem upload
        if (this.selectedFile && res?.user?.id) {
          this.uploadProfileImage(res.user.id);
        } else {
          // Dacă nu avem imagine, mergem direct la home
          this.loading = false;
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Register error', err);
        this.error = err?.error?.message || err?.error?.error || 'Înregistrarea a eșuat.';
      }
    });
  }

  // Upload imagine după register
  uploadProfileImage(userId: number): void {
    if (!this.selectedFile) {
      this.router.navigate(['/']);
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.authService.uploadProfileImage(userId, formData).subscribe({
      next: (response) => {
        console.log('Image uploaded:', response);
        
        // Actualizează user-ul în localStorage cu noua imagine
        if (response.profileImage) {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            currentUser.profileImage = response.profileImage;
            this.authService.saveCurrentUser(currentUser);
          }
        }

        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Image upload error:', err);
        // Chiar dacă imaginea nu se încarcă, îl ducem la home
        this.loading = false;
        this.router.navigate(['/']);
      }
    });
  }

  changeToLogin() {
    this.router.navigate(['/login']);
  }
}