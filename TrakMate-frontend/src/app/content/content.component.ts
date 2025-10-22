import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
constructor(private router: Router) {}
   changeToLogin() {
    this.router.navigate(['/login']);
}
}
