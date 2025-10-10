// app.routes.ts
import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProjectsComponent } from './projects/projects.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { StatsComponent } from './stats/stats.component';
import { authGuardTsGuard } from './auth/auth-guard.ts.guard';

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'projects', component: ProjectsComponent, canActivate: [authGuardTsGuard] },
  { path: 'calculator', component: CalculatorComponent, canActivate: [authGuardTsGuard] },
  { path: 'stats', component: StatsComponent, canActivate: [authGuardTsGuard] },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: '**', redirectTo: '/welcome' }
];