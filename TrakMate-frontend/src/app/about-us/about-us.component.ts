import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [NavBarComponent, FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  constructor(private router: Router) {}
  changeToRegister() {
    this.router.navigate(["/register"]); // make sure route matches
  }

  changeToLogin() {
    this.router.navigate(["/login"]); // make sure route matches
  }

  changeToCircuites() {
    this.router.navigate(["/circuites"]); // make sure route matches
  }
}