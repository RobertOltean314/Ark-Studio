import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Ark Studio';
  isWelcomePage: boolean = false;

  constructor(private router: Router, public authService: AuthService) {
    interface User {
      displayName: string;
      email: string;
      uid: string;
    }

    this.authService.user$.subscribe((user: User | null) => {
      console.log('Auth state changed:', user ? user.displayName : 'Logged out');
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isWelcomePage = event.url === '/welcome' || event.url === '/';
      });
  }
}