import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TimpPilotService } from '../services/timp-pilot.service';
import { AuthService } from '../services/auth.service';
import { TimeModel } from '../shared/timeModel';

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
  // date afișare
  times: TimeModel[] = [];
  pilotName = 'Pilot Necunoscut';
  loading = true;
  pilotId: number | null = null;

  // sortare
  sortBy: 'time' | 'date' = 'time';

  // formular creare timp pentru pilot
  showForm = false;
  form = { circuitName: '', country: '', lapTime: '' };

  currentUserId: number | null = null; // pentru verificare
  isAdminUser: boolean = false; // NOU: flag pentru Admin

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private timpPilotService: TimpPilotService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Verifică dacă e logat și ia userId
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id ?? null;
    this.isAdminUser = this.authService.isAdmin(); // NOU

    this.route.paramMap.subscribe((params) => {
      const idString = params.get('pilotId');
      this.pilotId = idString ? Number(idString) : null;

      // preia numele din state (fallback dacă nu există date din API)
      this.pilotName = history.state.pilotName || 'Pilot Necunoscut';

      if (this.pilotId) {
        this.loadPilotTimes(this.pilotId);
      } else {
        this.loading = false;
        this.router.navigate(['/pilot']);
      }
    });
  }

  loadPilotTimes(id: number): void {
    this.loading = true;
    this.timpPilotService.getPilotTimes(id).subscribe({
      next: (data) => {
        this.times = data ?? [];
        this.loading = false;

        // dacă API-ul a returnat pilotul, suprascrie numele
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

  /** Trimite spre backend un timp nou pentru pilotul curent */
  submitNewTime(): void {
    if (!this.pilotId) return;

    const { circuitName, country, lapTime } = this.form;
    if (!circuitName || !country || !lapTime) return;

    this.timpPilotService
      .addPilotTime(this.pilotId, { circuitName, country, lapTime })
      .subscribe({
        next: (_created) => {
          // curățare + reload
          this.form = { circuitName: '', country: '', lapTime: '' };
          this.showForm = false;
          this.loadPilotTimes(this.pilotId!);
        },
        error: (err) => {
          console.error('Eroare add pilot time', err);
          alert(err?.error?.message || 'Nu s-a putut adăuga timpul.');
        },
      });
  }

  // Șterge timp
  deleteTime(timeId: number): void {
    if (!this.pilotId) return;
    if (!confirm('Sigur vrei să ștergi acest timp?')) return;

    this.timpPilotService.deletePilotTime(this.pilotId, timeId).subscribe({
      next: () => {
        this.loadPilotTimes(this.pilotId!);
      },
      error: (err) => {
        console.error('Eroare delete time', err);
        alert(err?.error?.error || 'Nu s-a putut șterge timpul.');
      }
    });
  }

  // Verifică dacă timpul aparține userului logat
  isMyTime(time: TimeModel): boolean {
    return this.currentUserId !== null && time.pilot.id === this.currentUserId;
  }

  // Verifică dacă userul e logat
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // MODIFICAT: Admin poate edita orice pagină, Pilot doar a lui
  canEditPage(): boolean {
    return this.isAdminUser || (this.currentUserId !== null && this.currentUserId === this.pilotId);
  }

  // NOU: Admin poate șterge orice timp, Pilot doar al lui
  canDeleteTime(time: TimeModel): boolean {
    return this.isAdminUser || this.isMyTime(time);
  }

  /** Sortează local lista după cel mai rapid timp sau cea mai recentă dată */
  applySort(): void {
    if (!this.times?.length) return;

    this.times.sort((a, b) => {
      if (this.sortBy === 'time') {
        return a.lapTimeMs - b.lapTimeMs; // mai mic = mai rapid
      } else {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ); // recent primele
      }
    });
  }

  /** Formatează ms -> MM:SS.mmm */
  formatLapTime(ms: number): string {
    if (ms === undefined || ms === null) return 'N/A';
    const totalSeconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number, w: number) => n.toString().padStart(w, '0');
    return `${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(milliseconds, 3)}`;
  }
}