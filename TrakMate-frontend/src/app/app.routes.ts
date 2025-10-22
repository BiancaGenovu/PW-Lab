import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfileComponent } from './profile/profile.component';
import { CircuiteComponent } from './circuite/circuite.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PilotiComponent } from './piloti/piloti.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    
  { path: "", component: HomePageComponent },
  {path : "profile", component : ProfileComponent },
  {path: "circuite", component : CircuiteComponent },
  {path: "piloti", component : PilotiComponent },
  {path: "about-us", component : AboutUsComponent },
  {path: "login", component : LoginComponent },
  {path: "register",component: RegisterComponent}

];

