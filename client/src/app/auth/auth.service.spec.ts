import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';

describe('AuthService', () => {
  let service: AuthService;
  let mockAuth: any;

  beforeEach(() => {
    mockAuth = {
      currentUser: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      },
    };

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: Auth, useValue: mockAuth }],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user ID when logged in', () => {
    const userId = service.getUserId();
    expect(userId).toBe('test-uid');
  });

  it('should return user email', () => {
    const email = service.getUserEmail();
    expect(email).toBe('test@example.com');
  });

  it('should return user name', () => {
    const name = service.getUserName();
    expect(name).toBe('Test User');
  });

  it('should check if user is logged in', () => {
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return null when user not logged in', () => {
    mockAuth.currentUser = null;
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getUserId()).toBeNull();
  });
});
