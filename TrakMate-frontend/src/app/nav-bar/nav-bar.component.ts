import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(private router: Router) {}
 changeToProfile() {
    this.router.navigate(['/profile']); // make sure route matches
  }
  changeToPiloti() {
    this.router.navigate(['/pilot']); // make sure route matches
  }

  changeToCircuites() {
    this.router.navigate(["/circuites"]); // make sure route matches
  }

  changeToHomePage() {
    this.router.navigate(["/"]); // make sure route matches
  }

  changeToAbout_Us() {
    this.router.navigate(["/about-us"]); // make sure route matches
  }
}
