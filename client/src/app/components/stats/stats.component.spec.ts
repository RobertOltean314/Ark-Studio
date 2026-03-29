import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsComponent } from './stats.component';
import { StatisticsService } from '../../services/statistics.service';
import { AuthService } from '../../auth/auth.service';
import { of } from 'rxjs';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  beforeEach(async () => {
    const statisticsServiceMock = {
      getWeeklyStats: jasmine.createSpy().and.returnValue(of(null)),
    };

    const authServiceMock = {
      getUserId: jasmine.createSpy().and.returnValue('test-user'),
    };

    await TestBed.configureTestingModule({
      imports: [StatsComponent],
      providers: [
        { provide: StatisticsService, useValue: statisticsServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
