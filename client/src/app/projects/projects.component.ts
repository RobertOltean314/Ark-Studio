import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { FileUploadService } from '../services/file-upload.service';
import { AuthService } from '../auth/auth.service';
import { Project } from '../models/project.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  loading = true;
  isProcessing = false;
  showNewProjectForm = false;
  
  // Form data
  newProject: Partial<Project> = {};
  
  private projectsSubscription?: Subscription;

  constructor(
    private projectService: ProjectService,
    private fileUploadService: FileUploadService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
  }

  loadProjects() {
    const userId = this.authService.getUserId();
    console.log('User ID:', userId);
    console.log('User logged in:', this.authService.isLoggedIn());
    
    if (!userId) {
      console.error('User not authenticated');
      this.loading = false;
      return;
    }

    // Using real-time listener
    this.projectsSubscription = this.projectService.getUserProjectsRealtime(userId)
      .subscribe({
        next: (projects) => {
          console.log('Loaded projects:', projects);
          this.projects = projects;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading projects:', error);
          this.loading = false;
        }
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.fileUploadService.isValidVideoFile(file)) {
      alert('Please select a valid video file (MP4, AVI, MOV, WMV, FLV, WebM, MKV)');
      return;
    }

    this.processVideoFile(file);
  }

  async processVideoFile(file: File) {
    try {
      this.isProcessing = true;

      // Extract only the metadata we need (filename and duration)
      const videoMetadata = await this.fileUploadService.extractVideoMetadata(file);
      
      // Set up the new project with extracted metadata
      this.newProject = {
        fileName: videoMetadata.fileName,
        duration: videoMetadata.duration,
        name: videoMetadata.fileName.replace(/\.[^/.]+$/, ''), // Remove file extension for project name
        status: 'unpaid'
      };
      
      this.isProcessing = false;
      this.showNewProjectForm = true;
      
    } catch (error) {
      console.error('Error processing video:', error);
      this.isProcessing = false;
      alert('Error processing video file. Please ensure it is a valid video file.');
    }
  }

  async createProject() {
    const userId = this.authService.getUserId();
    console.log('Creating project for user:', userId);
    console.log('Project data:', this.newProject);
    
    if (!userId || !this.newProject.fileName || !this.newProject.duration) {
      console.error('Missing required data:', {userId, fileName: this.newProject.fileName, duration: this.newProject.duration});
      return;
    }

    const project: Omit<Project, 'id'> = {
      name: this.newProject.name || 'New Project',
      description: this.newProject.description,
      status: this.newProject.status || 'unpaid',
      fileName: this.newProject.fileName,
      duration: this.newProject.duration,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId
    };

    console.log('Final project object:', project);

    try {
      const projectId = await this.projectService.addProject(project);
      console.log('Project created with ID:', projectId);
      this.resetForm();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    }
  }

  resetForm() {
    this.newProject = {};
    this.showNewProjectForm = false;
  }

  toggleProjectStatus(project: Project) {
    if (!project.id) return;
    const newStatus = project.status === 'paid' ? 'unpaid' : 'paid';
    this.updateProjectField(project.id, { status: newStatus });
  }

  async updateProjectField(projectId: string, updates: Partial<Project>) {
    try {
      await this.projectService.updateProject(projectId, updates);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }

  async deleteProject(projectId: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await this.projectService.deleteProject(projectId);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  }

  formatDuration(seconds: number): string {
    return this.fileUploadService.formatDuration(seconds);
  }

  // Convert Firestore Timestamp to JavaScript Date
  toDate(timestamp: any): Date {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    return new Date(timestamp);
  }
}
