// app.routes.ts
import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProjectsComponent } from './projects/projects.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { StatsComponent } from './stats/stats.component';

export const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: 'stats', component: StatsComponent },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: '**', redirectTo: '/welcome' }
];