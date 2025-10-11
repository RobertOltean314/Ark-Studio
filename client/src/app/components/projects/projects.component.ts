import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ClientService } from '../../services/client.service';
import { FileUploadService } from '../../services/file-upload.service';
import { AuthService } from '../../auth/auth.service';
import { Project } from '../../models/project.interface';
import { Client } from '../../models/client.interface';
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
  clients: Client[] = [];
  loading = true;
  isProcessing = false;
  showNewProjectForm = false;
  showUpdateModal = false;

  newProject: Partial<Project> = {};
  editingProject: Partial<Project> = {};

  private projectsSubscription?: Subscription;
  private clientsSubscription?: Subscription;

  constructor(
    private projectService: ProjectService,
    private clientService: ClientService,
    private fileUploadService: FileUploadService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProjects();
    this.loadClients();
  }

  ngOnDestroy() {
    if (this.projectsSubscription) {
      this.projectsSubscription.unsubscribe();
    }
    if (this.clientsSubscription) {
      this.clientsSubscription.unsubscribe();
    }
  }

  loadProjects() {
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('User not authenticated');
      this.loading = false;
      return;
    }

    this.projectsSubscription = this.projectService.getUserProjectsRealtime(userId)
      .subscribe({
        next: (projects) => {
          this.projects = projects;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading projects:', error);
          this.loading = false;
        }
      });
  }

  loadClients() {
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    this.clientsSubscription = this.clientService.getUserClientsRealtime(userId)
      .subscribe({
        next: (clients) => {
          this.clients = clients;
        },
        error: (error) => {
          console.error('Error loading clients:', error);
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

      const videoMetadata = await this.fileUploadService.extractVideoMetadata(file);

      this.newProject = {
        fileName: videoMetadata.fileName,
        duration: videoMetadata.duration,
        name: videoMetadata.fileName.replace(/\.[^/.]+$/, ''),
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

    if (!userId || !this.newProject.fileName || !this.newProject.duration || this.newProject.duration <= 0) {
      alert('Please ensure all required fields are filled and duration is greater than 0.');
      return;
    }

    const project: Omit<Project, 'id'> = {
      name: this.newProject.name || 'New Project',
      status: this.newProject.status || 'unpaid',
      fileName: this.newProject.fileName,
      duration: this.newProject.duration,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId
    };

    if (this.newProject.description && this.newProject.description.trim()) {
      project.description = this.newProject.description.trim();
    }

    if (this.newProject.clientId) {
      project.clientId = this.newProject.clientId;
    }

    try {
      await this.projectService.addProject(project);
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

  toDate(timestamp: any): Date {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    return new Date(timestamp);
  }

  openUpdateModal(project: Project) {
    this.editingProject = { ...project };
    this.showUpdateModal = true;
  }

  closeUpdateModal() {
    this.editingProject = {};
    this.showUpdateModal = false;
  }

  async updateProject() {
    if (!this.editingProject.id) return;

    if (!this.editingProject.duration || this.editingProject.duration <= 0) {
      alert('Please ensure duration is greater than 0.');
      return;
    }

    try {
      const updates: Partial<Project> = {
        name: this.editingProject.name,
        fileName: this.editingProject.fileName,
        duration: this.editingProject.duration,
        status: this.editingProject.status
      };

      if (this.editingProject.description && this.editingProject.description.trim()) {
        updates.description = this.editingProject.description.trim();
      }

      if (this.editingProject.clientId) {
        updates.clientId = this.editingProject.clientId;
      }

      await this.projectService.updateProject(this.editingProject.id, updates);
      this.closeUpdateModal();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project. Please try again.');
    }
  }

  onDurationChange(event: any) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0) {
      this.newProject.duration = Math.round(value * 10) / 10;
    }
  }

  onEditDurationChange(event: any) {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0) {
      this.editingProject.duration = Math.round(value * 10) / 10;
    }
  }

  parseTimeString(timeStr: string): number {
    if (!timeStr) return 0;

    const parts = timeStr.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      const seconds = parseFloat(parts[2]) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseFloat(parts[1]) || 0;
      return minutes * 60 + seconds;
    } else {
      return parseFloat(timeStr) || 0;
    }
  }

  getClientName(clientId?: string): string {
    if (!clientId) return 'No client assigned';
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown client';
  }

  getClientRate(clientId?: string): number {
    if (!clientId) return 0;
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.ratePerSecond : 0;
  }

  goToClients() {
    this.router.navigate(['/clients']);
  }
}
