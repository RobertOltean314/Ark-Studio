import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsComponent } from './projects.component';
import { ProjectService } from '../../services/project.service';
import { ClientService } from '../../services/client.service';
import { FileUploadService } from '../../services/file-upload.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    const projectServiceMock = {
      getUserProjectsRealtime: jasmine.createSpy().and.returnValue(of([])),
    };

    const clientServiceMock = {
      getUserClients: jasmine.createSpy().and.returnValue(Promise.resolve([])),
    };

    const fileUploadServiceMock = {
      extractVideoMetadata: jasmine
        .createSpy()
        .and.returnValue(Promise.resolve({ duration: 100 })),
    };

    const authServiceMock = {
      getUserId: jasmine.createSpy().and.returnValue('test-user'),
    };

    const routerMock = {
      navigate: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
      providers: [
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: ClientService, useValue: clientServiceMock },
        { provide: FileUploadService, useValue: fileUploadServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty projects array', () => {
    expect(component.projects).toEqual([]);
  });
});
