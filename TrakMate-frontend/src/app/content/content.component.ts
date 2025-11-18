import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  changeToLogin() {
    this.router.navigate(['/login']);
  }

  changeToCircuites() {
    this.router.navigate(['/circuites']);
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/']); // rămâi pe home după delogare
  }
}