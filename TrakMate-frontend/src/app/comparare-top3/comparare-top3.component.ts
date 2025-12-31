import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { ComparareTop3Service } from '../services/comparare-top3.service';
import { AuthService } from '../services/auth.service';
import { CircuitesService } from '../services/circuites.service';
import { Top3Response, TimeRecord } from '../shared/comparareTop3Model';
import { circuitesModel } from '../shared/circuitesModel';
import { environment } from '../shared/environment';

@Component({
  selector: 'app-comparare-top3',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, FooterComponent],
  templateUrl: './comparare-top3.component.html',
  styleUrls: ['./comparare-top3.component.css']
})
export class ComparareTop3Component implements OnInit {
  circuits: circuitesModel[] = [];
  selectedCircuitId: number | null = null;
  
  loading = false;
  loadingCircuits = true;
  
  data: Top3Response | null = null;
  currentPilotId: number | null = null;

  constructor(
    private comparareTop3Service: ComparareTop3Service,
    private circuitesService: CircuitesService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentPilotId = user.id;
    this.loadCircuits();
  }

  loadCircuits(): void {
    this.loadingCircuits = true;
    this.circuitesService.getCircuites().subscribe({
      next: (circuits) => {
        this.circuits = circuits;
        this.loadingCircuits = false;
      },
      error: (err) => {
        console.error('Eroare la încărcarea circuitelor', err);
        this.loadingCircuits = false;
      }
    });
  }

  onCircuitChange(): void {
    if (!this.selectedCircuitId || !this.currentPilotId) return;
    
    this.loading = true;
    this.comparareTop3Service.compareWithTop3(this.currentPilotId, this.selectedCircuitId).subscribe({
      next: (response) => {
        this.data = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Eroare la comparare', err);
        this.loading = false;
        alert('Nu s-au putut încărca datele de comparație.');
      }
    });
  }

  getPilotImageUrl(pilot: TimeRecord['pilot']): string {
    if (pilot.profileImage) {
      return `${environment.backend_api}${pilot.profileImage}`;
    }
    return `https://via.placeholder.com/120/333333/999999?text=${pilot.firstName.charAt(0)}${pilot.lastName.charAt(0)}`;
  }

  formatTime(ms: number): string {
    if (ms == null) return 'N/A';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  }

  formatSectorTime(ms: number): string {
    if (ms == null) return 'N/A';
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
  }

  formatDiff(diff: number): string {
    const sign = diff > 0 ? '+' : '';
    return `${sign}${(diff / 1000).toFixed(3)}s`;
  }

  getMedalEmoji(index: number): string {
    const medals = ['🥇', '🥈', '🥉'];
    return medals[index] || '';
  }

  isMe(pilotId: number): boolean {
    return pilotId === this.currentPilotId;
  }

  goBack(): void {
    this.router.navigate(['/comparare']);
  }
}