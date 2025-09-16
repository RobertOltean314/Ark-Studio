import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, authState } from '@angular/fire/auth';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  user$: Observable<any>;

  constructor() {
    // Use authState for real-time user updates, shared across subscribers
    this.user$ = authState(this.auth).pipe(
      shareReplay(1) // Cache the latest user state for new subscribers
    );
  }

  async googleSignIn() {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    try {
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  async signOut() {
    await signOut(this.auth);
  }
}