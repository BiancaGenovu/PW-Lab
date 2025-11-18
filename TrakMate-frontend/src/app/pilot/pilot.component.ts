import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router'; // Adaugat: Import Router
import { PilotService } from '../services/pilot.service';
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

  // Injectare Router (declarația publică este necesară pentru a fi folosită în HTML)
  constructor(private pilotService: PilotService, public router: Router) {} 

  ngOnInit(): void {
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

  // Funcția nouă: Navighează la pagina cu timpii pilotului
  viewPilotTimes(pilot: pilotModel): void {
    this.router.navigate(['/pilot', pilot.id, 'times'], {
      state: { pilotName: `${pilot.firstName} ${pilot.lastName}` } // Trimite numele complet
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