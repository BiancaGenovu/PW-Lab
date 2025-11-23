import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CircuitesService } from '../services/circuites.service';
import { AuthService } from '../services/auth.service';
import { circuitesModel } from '../shared/circuitesModel';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../shared/environment';

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

  // Pentru editare
  editingCircuitId: number | null = null;

  // NOU: Pentru upload imagine
  selectedFile: File | null = null;
  uploading = false;
  uploadingCircuitId: number | null = null;

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

  // Adaugă/Editează circuit (Admin)
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

  // Începe editarea
  startEdit(circuit: circuitesModel): void {
    this.editingCircuitId = circuit.id;
    this.form = {
      name: circuit.name,
      km: circuit.km,
      country: circuit.country
    };
    this.showForm = true;
  }

  // Anulează editarea
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

  // NOU: Handler pentru selectare fișier
  onCircuitFileSelected(event: any, circuitId: number): void {
    const file = event.target.files[0];
    if (file) {
      // Verifică că e imagine
      if (!file.type.startsWith('image/')) {
        alert('Te rog selectează o imagine validă!');
        return;
      }
      // Verifică dimensiune (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Imaginea e prea mare! Max 5MB.');
        return;
      }
      this.selectedFile = file;
      this.uploadingCircuitId = circuitId;
      this.uploadCircuitImage(circuitId);
    }
  }

  // NOU: Upload imagine circuit
  uploadCircuitImage(circuitId: number): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.circuitesService.uploadCircuitImage(circuitId, this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload success:', response);
        this.uploading = false;
        this.selectedFile = null;
        this.uploadingCircuitId = null;
        this.loadCircuits();
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.uploading = false;
        this.selectedFile = null;
        this.uploadingCircuitId = null;
        alert(err?.error?.error || 'Nu s-a putut uploada imaginea.');
      }
    });
  }

  // NOU: Generează URL complet pentru imaginea circuitului
  getCircuitImageUrl(circuit: circuitesModel): string {
    if (circuit.circuitImage) {
      return `${environment.backend_api}${circuit.circuitImage}`;
    }
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect width="300" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
  }
}