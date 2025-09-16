import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';

  constructor(public authService: AuthService) {
    // Debug user state changes
    this.authService.user$.subscribe(user => {
      console.log('Auth state changed:', user ? user.displayName : 'Logged out');
    });
  }

  async signInWithGoogle() {
    try {
      await this.authService.googleSignIn();
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  }

  signOut() {
    this.authService.signOut();
  }
}