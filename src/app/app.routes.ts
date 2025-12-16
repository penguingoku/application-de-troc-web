import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { RegistrationComponent } from './registration/registration.component'; 
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { MesAnnoncesOffresComponent } from './mes-annonces-offres/mes-annonces-offres.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: AccueilComponent,
    canActivate: [authGuard]
  },
  { path: 'register', component: RegistrationComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'mes-annonces-offres', component: MesAnnoncesOffresComponent, canActivate: [authGuard] },
  {
    path: 'login',
    component: AuthentificationComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
