import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TimpPilotService } from '../services/timp-pilot.service';
import { AuthService } from '../services/auth.service';
import { TimeModel } from '../shared/timePilotModel'; 

import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-timp-pilot',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, NavBarComponent, FooterComponent],
  templateUrl: './timp-pilot.component.html',
  styleUrls: ['./timp-pilot.component.css'],
})
export class TimpPilotComponent implements OnInit {
  times: TimeModel[] = [];
  // Listă nouă pentru Dropdown
  circuits: any[] = [];
  
  pilotName = 'Pilot Necunoscut';
  loading = true;
  pilotId: number | null = null;

  sortBy: 'time' | 'date' = 'time';

  showForm = false;
  editingTimeId: number | null = null;

  // MODIFICAT: Folosim circuitId în loc de nume text
  form = { 
    circuitId: null as number | null, 
    country: '', 
    sector1: '', 
    sector2: '', 
    sector3: '' 
  };

  currentUserId: number | null = null;
  isAdminUser: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private timpPilotService: TimpPilotService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id ?? null;
    this.isAdminUser = this.authService.isAdmin();

    // Încărcăm lista de circuite pentru dropdown
    this.loadCircuitsList();

    this.route.paramMap.subscribe((params) => {
      const idString = params.get('pilotId');
      this.pilotId = idString ? Number(idString) : null;
      this.pilotName = history.state.pilotName || 'Pilot Necunoscut';

      if (this.pilotId) {
        this.loadPilotTimes(this.pilotId);
      } else {
        this.loading = false;
        this.router.navigate(['/pilot']);
      }
    });
  }

  // --- LOGICĂ NOUĂ PENTRU CIRCUITE ---
  
  loadCircuitsList(): void {
    // Presupunem că ai adăugat metoda getAllCircuits în Service așa cum am discutat
    this.timpPilotService.getAllCircuits().subscribe({
      next: (data) => {
        this.circuits = data;
      },
      error: (err) => console.error('Eroare la încărcarea circuitelor', err)
    });
  }

  // Când utilizatorul alege un circuit din listă, completăm automat țara
  onCircuitChange(): void {
    const selected = this.circuits.find(c => c.id == this.form.circuitId);
    if (selected) {
      this.form.country = selected.country;
    } else {
      this.form.country = '';
    }
  }

  // -----------------------------------

  loadPilotTimes(id: number): void {
    this.loading = true;
    this.timpPilotService.getPilotTimes(id).subscribe({
      next: (data) => {
        this.times = data ?? [];
        this.loading = false;

        if (this.times.length && this.times[0].pilot) {
          this.pilotName = `${this.times[0].pilot.firstName} ${this.times[0].pilot.lastName}`;
        }
        this.applySort();
      },
      error: (err) => {
        console.error('Eroare la încărcarea timpilor pilotului', err);
        this.loading = false;
      },
    });
  }

  submitForm(): void {
    if (!this.pilotId) return;

    // Validare: Verificăm circuitId în loc de circuitName
    const { circuitId, sector1, sector2, sector3 } = this.form;
    
    if (!circuitId || !sector1 || !sector2 || !sector3) {
      alert('Completează toate câmpurile!');
      return;
    }

    // Payload adaptat pentru a trimite ID-ul
    const payload = { 
      circuitId: Number(circuitId),
      // Backend-ul nu are nevoie de country la save, dar service-ul vechi poate cerea structura asta
      // O lăsăm goală sau o trimitem doar ca să nu dea eroare de tip Typescript, 
      // dar important e circuitId
      circuitName: '', 
      country: this.form.country, 
      sector1, 
      sector2, 
      sector3 
    };

    if (this.editingTimeId) {
      // --- MOD EDITARE ---
      this.timpPilotService.updatePilotTime(this.pilotId, this.editingTimeId, payload)
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadPilotTimes(this.pilotId!);
          },
          error: (err) => {
            console.error('Eroare update time', err);
            alert(err?.error?.message || 'Nu s-a putut actualiza timpul.');
          }
        });
    } else {
      // --- MOD ADĂUGARE ---
      // Aici apelăm funcția addPilotTime (atenție: asigură-te că în Service ai actualizat să accepte circuitId)
      this.timpPilotService.addPilotTime(this.pilotId, payload as any)
        .subscribe({
          next: () => {
            this.resetForm();
            this.loadPilotTimes(this.pilotId!);
          },
          error: (err) => {
            console.error('Eroare add pilot time', err);
            alert(err?.error?.message || 'Nu s-a putut adăuga timpul.');
          },
        });
    }
  }

  startEdit(time: TimeModel): void {
    this.editingTimeId = time.id;
    this.form = {
      // Preselectăm ID-ul circuitului existent
      circuitId: time.circuit.id,
      country: time.circuit.country,
      sector1: time.sector1Ms.toString(),
      sector2: time.sector2Ms.toString(),
      sector3: time.sector3Ms.toString()
    };
    this.showForm = true;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    // Resetăm form-ul cu circuitId null
    this.form = { circuitId: null, country: '', sector1: '', sector2: '', sector3: '' };
    this.editingTimeId = null;
    this.showForm = false;
  }

  deleteTime(timeId: number): void {
    if (!this.pilotId) return;
    if (!confirm('Sigur vrei să ștergi acest timp?')) return;

    this.timpPilotService.deletePilotTime(this.pilotId, timeId).subscribe({
      next: () => {
        if (this.editingTimeId === timeId) {
          this.resetForm();
        }
        this.loadPilotTimes(this.pilotId!);
      },
      error: (err) => {
        console.error('Eroare delete time', err);
        alert(err?.error?.error || 'Nu s-a putut șterge timpul.');
      }
    });
  }

  isMyTime(time: TimeModel): boolean {
    return this.currentUserId !== null && time.pilot.id === this.currentUserId;
  }

  canEditPage(): boolean {
    return this.isAdminUser || (this.currentUserId !== null && this.currentUserId === this.pilotId);
  }

  canDeleteTime(time: TimeModel): boolean {
    return this.isAdminUser || this.isMyTime(time);
  }

  applySort(): void {
    if (!this.times?.length) return;
    this.times.sort((a, b) => {
      if (this.sortBy === 'time') {
        return a.lapTimeMs - b.lapTimeMs;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }

  formatLapTime(ms: number): string {
    if (ms === undefined || ms === null) return 'N/A';
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