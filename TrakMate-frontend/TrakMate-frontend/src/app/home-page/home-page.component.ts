import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ContentComponent } from "../content/content.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NavBarComponent, ContentComponent, FooterComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
