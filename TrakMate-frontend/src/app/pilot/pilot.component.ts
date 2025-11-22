import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { PilotService } from '../services/pilot.service';
import { AuthService } from '../services/auth.service';
import { pilotModel } from '../shared/pilotModel';
import { FooterComponent } from '../footer/footer.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-pilot',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, NavBarComponent], 
  templateUrl: './pilot.component.html',
  styleUrls: ['./pilot.component.css']
})
export class PilotComponent implements OnInit {
  pilots: pilotModel[] = []; 
  filtered: pilotModel[] = []; 

  loading = true; 
  q = ''; 
  sortBy: 'firstName' | 'lastName' = 'lastName';

  // NOU: Pentru Admin
  isAdminUser: boolean = false;

  constructor(
    private pilotService: PilotService,
    private authService: AuthService,
    public router: Router
  ) {} 

  ngOnInit(): void {
    // Verifică dacă e Admin
    this.isAdminUser = this.authService.isAdmin();

    this.loadPilots();
  }

  loadPilots(): void {
    this.loading = true;
    this.pilotService.getPilot().subscribe({
      next: (data) => {
        this.pilots = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (e) => {
        console.error('Failed to load pilots', e);
        this.loading = false;
      }
    });
  }

  viewPilotTimes(pilot: pilotModel): void {
    this.router.navigate(['/pilot', pilot.id, 'times'], {
      state: { pilotName: `${pilot.firstName} ${pilot.lastName}` }
    });
  }

  // NOU: Șterge pilot (Admin)
  deletePilot(pilotId: number, pilotName: string): void {
    if (!confirm(`Sigur vrei să ștergi pilotul "${pilotName}"? Toate timpiile lui vor fi șterse!`)) {
      return;
    }

    this.pilotService.deletePilot(pilotId).subscribe({
      next: () => {
        this.loadPilots();
      },
      error: (err) => {
        console.error('Eroare delete pilot', err);
        alert(err?.error?.error || 'Nu s-a putut șterge pilotul.');
      }
    });
  }

  // --- Logica de Filtrare și Sortare ---

  applyFilters(): void {
    const q = this.q.trim().toLowerCase();

    let list = [...this.pilots]; 

    // 1. Filtrare
    if (q) {
      list = list.filter(p =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q)
      );
    }

    // 2. Sortare
    list.sort((a, b) => {
      if (this.sortBy === 'lastName') {
        return a.lastName.localeCompare(b.lastName);
      } else if (this.sortBy === 'firstName') {
        return a.firstName.localeCompare(b.firstName);
      }
      return 0;
    });

    this.filtered = list;
  }

  clearFilters(): void {
    this.q = ''; 
    this.sortBy = 'lastName'; 
    this.applyFilters();
  }
}