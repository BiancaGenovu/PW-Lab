import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CircuitesService } from '../services/circuites.service';
import { circuitesModel } from '../shared/circuitesModel';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-circuites',
  templateUrl: './circuites.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, NavBarComponent],
  styleUrls: ['./circuites.component.css']
})
export class CircuitesComponent implements OnInit {
  circuites: circuitesModel[] = [];
  filtered: circuitesModel[] = [];
  countries: string[] = [];

  loading = true;
  q = '';
  country = '';
  sortBy: 'name' | 'km' = 'name';

 constructor(private circuitesService: CircuitesService, public router: Router) {}

  ngOnInit(): void {
    // focus pe search cu tasta "/"
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('input[type="text"]');
        input?.focus();
      }
    });

    this.circuitesService.getCircuites().subscribe({
      next: (data) => {
        this.circuites = data;
        this.countries = [...new Set(data.map(d => d.country))].sort();
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilters(): void {
    const q = this.q.trim().toLowerCase();
    const country = this.country;

    let list = [...this.circuites];

    if (q) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
      );
    }

    if (country) {
      list = list.filter(c => c.country === country);
    }

    if (this.sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => a.km - b.km);
    }

    this.filtered = list;
  }

  setCountry(c: string) { this.country = c; this.applyFilters(); }

  clearFilters(): void {
    this.q = ''; this.country = ''; this.sortBy = 'name'; this.applyFilters();
  }

  

  circuiteDetails(circuiteID: number, circuiteName: string): void {
  // ATENȚIE: Ruta trebuie să fie '/circuites/:circuitId/times'
  // Trimitem ID-ul circuitului (circuiteID) și numele (circuiteName) prin state.
  this.router.navigate(['/circuites', circuiteID, 'times'], {
    state: { circuitName: circuiteName } // Trimiți numele pentru a fi afișat în header-ul paginii noi
  });
}
}
