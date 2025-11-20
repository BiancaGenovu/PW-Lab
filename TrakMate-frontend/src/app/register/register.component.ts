import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../services/auth.service';

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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
  this.loading = true;

  this.authService.register({
    email: this.email,
    password: this.password,
    firstName: this.firstName,
    lastName: this.lastName,
  }).subscribe({
    // îl lăsăm pe res ca any, ca să nu mai comenteze TS
    next: (res: any) => {
      this.loading = false;

      // salvăm token + user, ca la login
      if (res?.token) {
        this.authService.saveToken(res.token);
      }

      if (res?.user) {
        this.authService.saveCurrentUser(res.user);
      }

      // după register, îl ducem în home (sau în login, cum preferi)
      this.router.navigate(['/']);
    },
    error: (err: any) => {
      this.loading = false;
      console.error('Register error', err);
      alert(err?.error?.message || 'Înregistrarea a eșuat.');
    }
  });
}


  changeToLogin() {
    this.router.navigate(['/login']);
  }
}