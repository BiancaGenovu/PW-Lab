import { Component } from '@angular/core';
import { NavBarComponent } from "../../../TrakMate-frontend/src/app/nav-bar/nav-bar.component";
import { FooterComponent } from "../../../TrakMate-frontend/src/app/footer/footer.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavBarComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private router: Router) {}
     changeToRegister() {
      this.router.navigate(['/register']);
}
}
