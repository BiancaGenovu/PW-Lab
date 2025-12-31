import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TimpCircuitService } from '../services/timp-circuit.service';
import { AuthService } from '../services/auth.service';
import { TimeModel } from '../shared/timeModel';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-timp-circuit',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, FooterComponent],
  templateUrl: './timp-circuit.component.html',
  styleUrls: ['./timp-circuit.component.css']
})
export class TimpCircuitComponent implements OnInit {
  times: TimeModel[] = [];
  circuitName = 'Încărcare...';
  circuitCountry = ''; // Adăugat pentru a afișa și țara
  circuitId: number | null = null;
  loading = true;

  sortBy: 'time' | 'date' = 'time';

  showForm = false;
  
  // Variabilă nouă pentru a reține ID-ul timpului pe care îl edităm
  editingTimeId: number | null = null;

  form = { 
    sector1: '', 
    sector2: '', 
    sector3: '' 
  };

  currentUserId: number | null = null;
  isAdminUser: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private svc: TimpCircuitService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id ?? null;
    this.isAdminUser = this.authService.isAdmin();

    this.route.paramMap.subscribe(params => {
      const idStr = params.get('circuitId');
      this.circuitId = idStr ? Number(idStr) : null;
      this.circuitName = history.state.circuitName || 'Timpi circuit';

      if (this.circuitId) {
        this.fetchTimes(this.circuitId);
      } else {
        this.loading = false;
        this.router.navigate(['/circuites']);
      }
    });
  }

  fetchTimes(id: number): void {
    this.loading = true;
    this.svc.getCircuitTimes(id).subscribe({
      next: data => {
        this.times = data ?? [];
        if (this.times.length && this.times[0].circuit) {
           this.circuitName = this.times[0].circuit.name;
           this.circuitCountry = this.times[0].circuit.country;
        }
        this.applySort();
        this.loading = false;
      },
      error: err => {
        console.error('Eroare fetch times', err);
        this.loading = false;
      }
    });
  }

  // --- LOGICA DE ADĂUGARE ȘI EDITARE ---

  submitForm(): void {
    if (!this.circuitId) return;
    
    const { sector1, sector2, sector3 } = this.form;
    if (!sector1 || !sector2 || !sector3) {
      alert('Completează toate sectoarele!');
      return;
    }

    const payload = { sector1, sector2, sector3 };

    if (this.editingTimeId) {
      // --- UPDATE (MODIFICARE) ---
      this.svc.updateCircuitTime(this.circuitId, this.editingTimeId, payload).subscribe({
        next: () => {
          this.resetForm();
          this.fetchTimes(this.circuitId!);
        },
        error: err => {
          console.error('Eroare update time', err);
          alert(err?.error?.error || 'Nu s-a putut actualiza timpul.');
        }
      });
    } else {
      // --- CREATE (ADĂUGARE) ---
      this.svc.addCircuitTime(this.circuitId, payload).subscribe({
        next: () => {
          this.resetForm();
          this.fetchTimes(this.circuitId!);
        },
        error: err => {
          console.error('Eroare add time', err);
          alert(err?.error?.error || err?.error?.detail || 'Nu s-a putut adăuga timpul.');
        }
      });
    }
  }

  // Funcție apelată când apeși pe butonul "Creion"
  startEdit(time: TimeModel): void {
    this.editingTimeId = time.id;
    this.form = { 
      sector1: time.sector1Ms.toString(), 
      sector2: time.sector2Ms.toString(), 
      sector3: time.sector3Ms.toString() 
    };
    this.showForm = true;
    // Scroll opțional sus la formular
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Funcție pentru butonul "Anulează"
  cancelEdit(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.form = { sector1: '', sector2: '', sector3: '' };
    this.editingTimeId = null;
    this.showForm = false;
  }

  // --- LOGICA DE ȘTERGERE ---

  deleteTime(timeId: number): void {
    if (!this.circuitId) return;
    if (!confirm('Sigur vrei să ștergi acest timp?')) return;

    this.svc.deleteCircuitTime(this.circuitId, timeId).subscribe({
      next: () => {
        // Dacă ștergeam exact timpul pe care îl editam, resetăm formularul
        if (this.editingTimeId === timeId) {
          this.resetForm();
        }
        this.fetchTimes(this.circuitId!);
      },
      error: err => {
        console.error('Eroare delete time', err);
        alert(err?.error?.error || 'Nu s-a putut șterge timpul.');
      }
    });
  }

  // --- HELPERE ---

  isMyTime(time: TimeModel): boolean {
    return this.currentUserId !== null && time.pilot.id === this.currentUserId;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Folosită în HTML pentru a arăta butoanele de Edit/Delete
  canModifyTime(time: TimeModel): boolean {
    return this.isAdminUser || this.isMyTime(time);
  }

  applySort(): void {
    if (!this.times?.length) return;
    this.times.sort((a, b) => {
      if (this.sortBy === 'time') {
        return a.lapTimeMs - b.lapTimeMs;
      } else {
        const ad = new Date(a.createdAt).getTime();
        const bd = new Date(b.createdAt).getTime();
        return bd - ad;
      }
    });
  }

  formatLapTime(ms: number): string {
    if (ms == null) return 'N/A';
    const totalSeconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number, w: number) => n.toString().padStart(w, '0');
    return `${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(milliseconds, 3)}`;
  }

  formatSectorTime(ms: number): string {
    if (ms == null) return 'N/A';
    const totalSeconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    const seconds = totalSeconds % 60;
    const pad = (n: number, w: number) => n.toString().padStart(w, '0');
    return `${pad(seconds, 2)}.${pad(milliseconds, 3)}`;
  }
}