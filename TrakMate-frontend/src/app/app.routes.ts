import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfileComponent } from './profile/profile.component';
import { CircuitesComponent } from './circuites/circuites.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PilotComponent } from './pilot/pilot.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TimpCircuitComponent } from './timp-circuit/timp-circuit.component';
import { TimpPilotComponent } from './timp-pilot/timp-pilot.component';
import { authGuard } from './guards/auth.guard';
import { ComparatiiComponent } from './comparatii/comparatii.component';

export const routes: Routes = [
    
  { path: "", component: HomePageComponent },
  {path : "profile", component : ProfileComponent, canActivate: [authGuard]},
  {path: "circuites", component : CircuitesComponent },
  {path: "pilot", component : PilotComponent },
  {path: "about-us", component : AboutUsComponent },
  {path: "login", component : LoginComponent },
  {path: "register",component: RegisterComponent},
  {path: "comparatii", component: ComparatiiComponent},
  {path: "evolutia-mea", loadComponent: () => import('./evolutia-mea/evolutia-mea.component').then(m => m.EvolutiaMeaComponent), canActivate: [authGuard]},
  {path: "comparare-pilot", loadComponent: () => import('./comparare-pilot/comparare-pilot.component').then(m => m.CompararePilotComponent), canActivate: [authGuard]},
  {path: 'circuites/:circuitId/times', component: TimpCircuitComponent},
  {path: 'pilot/:pilotId/times', component: TimpPilotComponent}

];

