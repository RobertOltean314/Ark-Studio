import { TestBed } from '@angular/core/testing';
import { StatisticsService } from './statistics.service';
import { Firestore } from '@angular/fire/firestore';

describe('StatisticsService', () => {
  let service: StatisticsService;

  beforeEach(() => {
    const firestoreMock = {};

    TestBed.configureTestingModule({
      providers: [
        StatisticsService,
        { provide: Firestore, useValue: firestoreMock },
      ],
    });

    service = TestBed.inject(StatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
