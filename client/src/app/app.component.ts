import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Ark Studio';

  constructor(public authService: AuthService) {
    interface User {
      displayName: string;
      email: string;
      uid: string;
    }

    this.authService.user$.subscribe((user: User | null) => {
      console.log('Auth state changed:', user ? user.displayName : 'Logged out');
    });
  }
}