import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarComponent } from "../../../TrakMate-frontend/src/app/nav-bar/nav-bar.component";
import { FooterComponent } from "../../../TrakMate-frontend/src/app/footer/footer.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NavBarComponent, FooterComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private router: Router) {}
       changeToLogin() {
        this.router.navigate(['/login']);
}
}
