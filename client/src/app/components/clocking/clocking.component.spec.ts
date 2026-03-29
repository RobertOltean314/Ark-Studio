import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClockingComponent } from './clocking.component';
import { TimeTrackingService } from '../../services/time-tracking.service';
import { AuthService } from '../../auth/auth.service';
import { of } from 'rxjs';

describe('ClockingComponent', () => {
  let component: ClockingComponent;
  let fixture: ComponentFixture<ClockingComponent>;

  beforeEach(async () => {
    const timeTrackingServiceMock = {
      getTodayEntryRealtime: jasmine.createSpy().and.returnValue(of(null)),
    };

    const authServiceMock = {
      getUserId: jasmine.createSpy().and.returnValue('test-user'),
    };

    await TestBed.configureTestingModule({
      imports: [ClockingComponent],
      providers: [
        { provide: TimeTrackingService, useValue: timeTrackingServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClockingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
