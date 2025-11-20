import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.error = null;

    if (!this.email || !this.password) {
      this.error = 'Te rog completează emailul și parola.';
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
  next: (res: any) => {
    this.loading = false;

    const token = res?.token;
    if (token) {
      this.authService.saveToken(token);
    }

    if (res?.user) {
      this.authService.saveCurrentUser(res.user)
    }

    this.router.navigate(['/']);
  },
  error: (err: any) => {
    this.loading = false;
    alert(err?.error?.message || 'Conectarea a eșuat.');
  }
});
  }

  changeToRegister() {
    this.router.navigate(['/register']);
}
}