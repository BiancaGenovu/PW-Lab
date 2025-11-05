import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
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
  // S-a eliminat 'id' ca opțiune de sortare
  sortBy: 'firstName' | 'lastName' = 'lastName'; 

  constructor(private pilotService: PilotService) {}

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
      // S-a eliminat logica de sortare după ID
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