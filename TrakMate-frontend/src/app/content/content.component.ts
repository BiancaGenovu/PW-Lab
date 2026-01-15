import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
// IMPORT NOU
import { ContentService } from '../services/content.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  // Variabile pentru statistici (valori inițiale 0 sau "...")
  totalCircuits: number | string = '...';
  totalTimes: number | string = '...';

  constructor(
    private router: Router,
    private authService: AuthService,
    private contentService: ContentService // Injectăm service-ul
  ) {}

  ngOnInit(): void {
    // Încărcăm datele reale
    this.contentService.getHomepageStats().subscribe({
      next: (data) => {
        this.totalCircuits = data.circuits;
        this.totalTimes = data.times;
      },
      error: (err) => {
        console.error('Nu am putut încărca statisticile', err);
        // Fallback în caz de eroare
        this.totalCircuits = 23; 
        this.totalTimes = '1000+';
      }
    });
  }

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
    this.router.navigate(['/']); 
  }
}