import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, authState } from '@angular/fire/auth';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth).pipe(
      shareReplay(1)
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

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  getUserName(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.displayName : null;
  }

  getUserEmail(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.email : null;
  }

  getUserId(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }
}