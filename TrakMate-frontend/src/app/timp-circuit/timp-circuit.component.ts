import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TimpCircuitService } from '../services/timp-circuit.service';
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
  circuitId: number | null = null;
  loading = true;

  sortBy: 'time' | 'date' = 'time';

  showForm = false;
  form = { firstName: '', lastName: '', lapTime: '' };

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private svc: TimpCircuitService
  ) {}

  ngOnInit(): void {
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
        if (this.times.length) this.circuitName = this.times[0].circuit.name;
        this.applySort();
        this.loading = false;
      },
      error: err => {
        console.error('Eroare fetch times', err);
        this.loading = false;
      }
    });
  }

  submitNewTime(): void {
    if (!this.circuitId) return;
    const { firstName, lastName, lapTime } = this.form;
    if (!firstName || !lastName || !lapTime) return;

    this.svc.addCircuitTime(this.circuitId, { firstName, lastName, lapTime }).subscribe({
      next: _created => {
        // IMPORTANT: reîncărcăm lista de pe server pentru consistență
        this.form = { firstName: '', lastName: '', lapTime: '' };
        this.showForm = false;
        this.fetchTimes(this.circuitId!);
      },
      error: err => {
        console.error('Eroare add time', err);
        alert(err?.error?.detail || 'Nu s-a putut adăuga timpul.');
      }
    });
  }

  applySort(): void {
    if (!this.times?.length) return;
    this.times.sort((a, b) => {
      if (this.sortBy === 'time') {
        return a.lapTimeMs - b.lapTimeMs;
      } else {
        const ad = new Date(a.createdAt).getTime();
        const bd = new Date(b.createdAt).getTime();
        return bd - ad; // recent primele
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
}
