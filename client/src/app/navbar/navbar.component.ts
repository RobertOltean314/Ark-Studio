import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isUserMenuOpen = false;
  userName: string | null = null;
  userEmail: string | null = null;
  isAuthenticated: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        this.isUserMenuOpen = false;
      }
    });

    this.authService.user$?.subscribe(user => {
      this.userName = user?.displayName || null;
      this.userEmail = user?.email || null;
      this.isAuthenticated = !!user; 
    });
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  getUserName(): string | null {
    return this.userName;
  }

  getUserEmail(): string | null {
    return this.userEmail;
  } 

  goToSettings(): void {
    this.isUserMenuOpen = false;
    this.router.navigate(['/settings']);
  }

  goToWelcome(): void {
    this.router.navigate(['/welcome']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  signOut(): void {
    this.isUserMenuOpen = false;
    this.authService.signOut();
    this.router.navigate(['/welcome']);
  }
}