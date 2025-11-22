import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CircuitesService } from '../services/circuites.service';
import { AuthService } from '../services/auth.service';
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

  // Pentru Admin
  isAdminUser: boolean = false;
  showForm = false;
  form = { name: '', km: 0, country: '' };

  // NOU: Pentru editare
  editingCircuitId: number | null = null;

  constructor(
    private circuitesService: CircuitesService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Verifică dacă e Admin
    this.isAdminUser = this.authService.isAdmin();

    // focus pe search cu tasta "/"
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('input[type="text"]');
        input?.focus();
      }
    });

    this.loadCircuits();
  }

  loadCircuits(): void {
    this.loading = true;
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

  setCountry(c: string) { 
    this.country = c; 
    this.applyFilters(); 
  }

  clearFilters(): void {
    this.q = ''; 
    this.country = ''; 
    this.sortBy = 'name'; 
    this.applyFilters();
  }

  circuiteDetails(circuiteID: number, circuiteName: string): void {
    this.router.navigate(['/circuites', circuiteID, 'times'], {
      state: { circuitName: circuiteName }
    });
  }

  // Adaugă circuit (Admin)
  submitNewCircuit(): void {
    const { name, km, country } = this.form;
    if (!name || !km || !country) {
      alert('Completează toate câmpurile!');
      return;
    }

    // Dacă editezi
    if (this.editingCircuitId !== null) {
      this.circuitesService.updateCircuit(this.editingCircuitId, { name, km, country }).subscribe({
        next: () => {
          this.form = { name: '', km: 0, country: '' };
          this.showForm = false;
          this.editingCircuitId = null;
          this.loadCircuits();
        },
        error: (err) => {
          console.error('Eroare update circuit', err);
          alert(err?.error?.error || 'Nu s-a putut actualiza circuitul.');
        }
      });
    } else {
      // Adaugă nou
      this.circuitesService.addCircuit({ name, km, country }).subscribe({
        next: () => {
          this.form = { name: '', km: 0, country: '' };
          this.showForm = false;
          this.loadCircuits();
        },
        error: (err) => {
          console.error('Eroare add circuit', err);
          alert(err?.error?.error || 'Nu s-a putut adăuga circuitul.');
        }
      });
    }
  }

  // NOU: Începe editarea
  startEdit(circuit: circuitesModel): void {
    this.editingCircuitId = circuit.id;
    this.form = {
      name: circuit.name,
      km: circuit.km,
      country: circuit.country
    };
    this.showForm = true;
  }

  // NOU: Anulează editarea
  cancelEdit(): void {
    this.form = { name: '', km: 0, country: '' };
    this.showForm = false;
    this.editingCircuitId = null;
  }

  // Șterge circuit (Admin)
  deleteCircuit(circuitId: number, circuitName: string): void {
    if (!confirm(`Sigur vrei să ștergi circuitul "${circuitName}"? Vor fi șterse și toate timpiile!`)) {
      return;
    }

    this.circuitesService.deleteCircuit(circuitId).subscribe({
      next: () => {
        this.loadCircuits();
      },
      error: (err) => {
        console.error('Eroare delete circuit', err);
        alert(err?.error?.error || 'Nu s-a putut șterge circuitul.');
      }
    });
  }
}