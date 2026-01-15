import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { EvolutiaMeaService } from '../services/evolutia-mea.service';
import { AuthService } from '../services/auth.service';
import { CircuitesService } from '../services/circuites.service';
import { EvolutionResponse } from '../shared/evolutiaMea';
import { circuitesModel } from '../shared/circuitesModel';

@Component({
  selector: 'app-comparare-personala',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, FooterComponent],
  templateUrl: './evolutia-mea.component.html',
  styleUrls: ['./evolutia-mea.component.css']
})
export class EvolutiaMeaComponent implements OnInit {
  circuits: circuitesModel[] = [];
  selectedCircuitId: number | null = null;
  
  loading = false;
  loadingCircuits = true;
  
  data: EvolutionResponse | null = null;
  currentPilotId: number | null = null;

  constructor(
    private evolutiaMeaService: EvolutiaMeaService,
    private circuitesService: CircuitesService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Verifică dacă e logat
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
    this.evolutiaMeaService.getMyEvolution(this.currentPilotId, this.selectedCircuitId).subscribe({
      next: (response) => {
        this.data = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Eroare la încărcarea evoluției', err);
        this.loading = false;
        alert('Nu s-au putut încărca datele de evoluție.');
      }
    });
  }

  /**
   * Calculează intervalul total (diferența dintre cel mai rău și cel mai bun timp).
   */
  getDeltaRange(): number {
    if (!this.data || !this.data.stats) return 1;
    
    const delta = this.data.stats.worstTime - this.data.stats.bestTime;
    return delta > 0 ? delta : 1; 
  }

  /**
   * Generează coordonatele pentru linia SVG (NOU)
   * Format: "x1,y1 x2,y2 ..."
   */
  getChartPoints(): string {
    if (!this.data || !this.data.times || this.data.times.length < 2) {
      return '';
    }

    const range = this.getDeltaRange();
    const worst = this.data.stats!.worstTime;
    const totalPoints = this.data.times.length;
    
    return this.data.times.map((time, i) => {
      // Calculăm X: procentual pe lățime (0 -> 100)
      const x = (i / (totalPoints - 1)) * 100;

      // Calculăm Y: procentual pe înălțime (0 -> 100)
      // În SVG, 0 e sus, 100 e jos. 
      // Calculăm întâi cât de "jos" e punctul (ca în HTML bottom%), apoi scădem din 100.
      const bottomPerc = ((worst - time.lapTimeMs) / range) * 100;
      const y = 100 - bottomPerc;

      return `${x},${y}`;
    }).join(' ');
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

  getDiffClass(diff: number): string {
    if (diff < 0) return 'positive'; // mai bun
    if (diff > 0) return 'negative'; // mai rău
    return 'neutral';
  }

  getConsistencyColor(consistency: number): string {
    if (consistency >= 95) return '#10b981'; // verde
    if (consistency >= 85) return '#f59e0b'; // galben
    return '#ef4444'; // roșu
  }

  goBack(): void {
    this.router.navigate(['/comparatii']);
  }
}