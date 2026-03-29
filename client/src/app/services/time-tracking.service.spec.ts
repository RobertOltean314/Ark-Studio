import { TestBed } from '@angular/core/testing';
import { TimeTrackingService } from './time-tracking.service';
import { Firestore } from '@angular/fire/firestore';
import { Injector } from '@angular/core';

describe('TimeTrackingService', () => {
  let service: TimeTrackingService;

  beforeEach(() => {
    const firestoreMock = {};

    TestBed.configureTestingModule({
      providers: [
        TimeTrackingService,
        { provide: Firestore, useValue: firestoreMock },
      ],
    });

    service = TestBed.inject(TimeTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should format duration correctly', () => {
    expect(service.formatDuration(0)).toBe('00:00:00');
    expect(service.formatDuration(3661)).toBe('01:01:01');
    expect(service.formatDuration(7325)).toBe('02:02:05');
  });
});
