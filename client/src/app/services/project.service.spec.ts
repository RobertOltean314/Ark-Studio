import { TestBed } from '@angular/core/testing';
import { ProjectService } from './project.service';
import { Firestore } from '@angular/fire/firestore';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(() => {
    const firestoreMock = {};

    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        { provide: Firestore, useValue: firestoreMock },
      ],
    });

    service = TestBed.inject(ProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
