import { TestBed } from '@angular/core/testing';
import { ProjectService } from '../services/project.service';
import { ClientService } from '../services/client.service';
import { TimeTrackingService } from '../services/time-tracking.service';
import { AuthService } from '../auth/auth.service';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

/**
 * Integration Tests
 * These tests verify that multiple services work together correctly
 */
describe('Integration Tests', () => {
  let projectService: ProjectService;
  let clientService: ClientService;
  let timeTrackingService: TimeTrackingService;
  let authService: AuthService;

  beforeEach(() => {
    const firestoreMock = {};
    const authMock = {
      currentUser: {
        uid: 'integration-test-user',
        email: 'integration@test.com',
        displayName: 'Integration Test User',
      },
    };

    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        ClientService,
        TimeTrackingService,
        AuthService,
        { provide: Firestore, useValue: firestoreMock },
        { provide: Auth, useValue: authMock },
      ],
    });

    projectService = TestBed.inject(ProjectService);
    clientService = TestBed.inject(ClientService);
    timeTrackingService = TestBed.inject(TimeTrackingService);
    authService = TestBed.inject(AuthService);
  });

  describe('Service Dependencies', () => {
    it('should create all services', () => {
      expect(projectService).toBeTruthy();
      expect(clientService).toBeTruthy();
      expect(timeTrackingService).toBeTruthy();
      expect(authService).toBeTruthy();
    });

    it('should have consistent user ID across services', () => {
      const userId = authService.getUserId();
      expect(userId).toBe('integration-test-user');
      expect(userId).toBeTruthy();
    });
  });

  describe('Time Tracking Utilities', () => {
    it('should format durations consistently', () => {
      const duration = 3665; // 1 hour, 1 minute, 5 seconds
      const formatted = timeTrackingService.formatDuration(duration);
      expect(formatted).toBe('01:01:05');
    });

    it('should handle zero duration', () => {
      const formatted = timeTrackingService.formatDuration(0);
      expect(formatted).toBe('00:00:00');
    });

    it('should handle large durations', () => {
      const duration = 86400; // 24 hours
      const formatted = timeTrackingService.formatDuration(duration);
      expect(formatted).toBe('24:00:00');
    });
  });

  describe('Authentication State', () => {
    it('should indicate user is logged in', () => {
      expect(authService.isLoggedIn()).toBe(true);
    });

    it('should provide user information', () => {
      expect(authService.getUserEmail()).toBe('integration@test.com');
      expect(authService.getUserName()).toBe('Integration Test User');
    });
  });
});
