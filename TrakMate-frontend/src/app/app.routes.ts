import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfileComponent } from './profile/profile.component';
import { CircuitesComponent } from './circuites/circuites.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PilotComponent } from './pilot/pilot.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    
  { path: "", component: HomePageComponent },
  {path : "profile", component : ProfileComponent },
  {path: "circuites", component : CircuitesComponent },
  {path: "pilot", component : PilotComponent },
  {path: "about-us", component : AboutUsComponent },
  {path: "login", component : LoginComponent },
  {path: "register",component: RegisterComponent}

];

