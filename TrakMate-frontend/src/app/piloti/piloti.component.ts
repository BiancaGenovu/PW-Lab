import { Component } from '@angular/core';
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-piloti',
  standalone: true,
  imports: [NavBarComponent, FooterComponent],
  templateUrl: './piloti.component.html',
  styleUrl: './piloti.component.css'
})
export class PilotiComponent {

}
