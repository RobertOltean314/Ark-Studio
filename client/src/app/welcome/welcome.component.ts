import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteService, Quote } from './quote.service';
import { AuthService } from '../auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations: [
    trigger('cardFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('quoteFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('400ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class WelcomeComponent implements OnInit {
  title = 'Ark Studio';
  quote: Quote | null = null;
  isLoading = false;

  constructor(public authService: AuthService, private quoteService: QuoteService) {}

  ngOnInit() {}

  async signInWithGoogle() {
    this.isLoading = true;
    try {
      await this.authService.googleSignIn();
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  }

  goToDashboard() {
    window.location.href = '/dashboard'; // Adjust the URL as needed
  }

  signOut() {
    this.authService.signOut();
  }

}