import { TestBed } from '@angular/core/testing';
import { ClientService } from './client.service';
import { Firestore } from '@angular/fire/firestore';

describe('ClientService', () => {
  let service: ClientService;

  beforeEach(() => {
    const firestoreMock = {};

    TestBed.configureTestingModule({
      providers: [
        ClientService,
        { provide: Firestore, useValue: firestoreMock },
      ],
    });

    service = TestBed.inject(ClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
