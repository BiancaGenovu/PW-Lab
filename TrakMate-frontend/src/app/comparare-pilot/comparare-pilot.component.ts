import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { CompararePilotService } from '../services/comparare-pilot.service';
import { AuthService } from '../services/auth.service';
import { CircuitesService } from '../services/circuites.service';
import { PilotService } from '../services/pilot.service';
import { PilotComparisonResponse } from '../shared/compararePilotModel';
import { circuitesModel } from '../shared/circuitesModel';
import { pilotModel } from '../shared/pilotModel';
import { environment } from '../shared/environment';

@Component({
  selector: 'app-comparare-pilot',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, FooterComponent],
  templateUrl: './comparare-pilot.component.html',
  styleUrls: ['./comparare-pilot.component.css']
})
export class CompararePilotComponent implements OnInit {
  circuits: circuitesModel[] = [];
  pilots: pilotModel[] = [];
  
  selectedCircuitId: number | null = null;
  selectedRivalId: number | null = null;
  
  loading = false;
  loadingCircuits = true;
  loadingPilots = true;
  
  data: PilotComparisonResponse | null = null;
  currentPilotId: number | null = null;

  constructor(
    private compararePilotService: CompararePilotService,
    private circuitesService: CircuitesService,
    private pilotService: PilotService,
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
    this.loadPilots();
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

  loadPilots(): void {
    this.loadingPilots = true;
    this.pilotService.getPilot().subscribe({
      next: (pilots) => {
        // Exclude-te pe tine din listă
        this.pilots = pilots.filter(p => p.id !== this.currentPilotId);
        this.loadingPilots = false;
      },
      error: (err) => {
        console.error('Eroare la încărcarea piloților', err);
        this.loadingPilots = false;
      }
    });
  }

  onCompare(): void {
    if (!this.selectedCircuitId || !this.selectedRivalId || !this.currentPilotId) {
      alert('Selectează atât circuitul, cât și pilotul rival!');
      return;
    }
    
    this.loading = true;
    this.compararePilotService.comparePilots(
      this.currentPilotId, 
      this.selectedRivalId, 
      this.selectedCircuitId
    ).subscribe({
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

  getPilotImageUrl(pilot: pilotModel): string {
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

  getSectorLabel(sector: string): string {
    const labels: any = {
      'sector1': 'Sector 1',
      'sector2': 'Sector 2',
      'sector3': 'Sector 3'
    };
    return labels[sector] || sector;
  }

  goBack(): void {
    this.router.navigate(['/comparatii']);
  }

  getMaxSector(you: number, rival: number): number {
  return Math.max(you, rival);
}
}