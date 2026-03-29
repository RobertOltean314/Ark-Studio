import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientsComponent } from './clients.component';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../auth/auth.service';
import { of } from 'rxjs';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;

  beforeEach(async () => {
    const clientServiceMock = {
      getUserClientsRealtime: jasmine.createSpy().and.returnValue(of([])),
    };

    const authServiceMock = {
      getUserId: jasmine.createSpy().and.returnValue('test-user'),
    };

    await TestBed.configureTestingModule({
      imports: [ClientsComponent],
      providers: [
        { provide: ClientService, useValue: clientServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty clients array', () => {
    expect(component.clients).toEqual([]);
  });
});
