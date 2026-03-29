import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';
import { ProjectService } from '../../services/project.service';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../auth/auth.service';
import { of } from 'rxjs';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    const projectServiceMock = {
      getUnpaidProjectsRealtime: jasmine.createSpy().and.returnValue(of([])),
    };

    const clientServiceMock = {
      getUserClientsRealtime: jasmine.createSpy().and.returnValue(of([])),
    };

    const authServiceMock = {
      getUserId: jasmine.createSpy().and.returnValue('test-user'),
    };

    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
      providers: [
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: ClientService, useValue: clientServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty calculator projects', () => {
    expect(component.calculatorProjects).toEqual([]);
  });

  it('should have pagination settings', () => {
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(10);
  });
});
