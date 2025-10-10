// app.routes.ts
import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { StatsComponent } from './components/stats/stats.component';
import { ClockingComponent } from './components/clocking/clocking.component';
import { authGuardTsGuard } from './auth/auth-guard.ts.guard';

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'projects', component: ProjectsComponent, canActivate: [authGuardTsGuard] },
  { path: 'calculator', component: CalculatorComponent, canActivate: [authGuardTsGuard] },
  { path: 'stats', component: StatsComponent, canActivate: [authGuardTsGuard] },
  { path: 'clocking', component: ClockingComponent, canActivate: [authGuardTsGuard] },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: '**', redirectTo: '/welcome' }
];