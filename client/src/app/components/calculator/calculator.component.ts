import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectService } from '../../services/project.service';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../auth/auth.service';
import { CalculatorProject, CalculatorSummary } from '../../models/calculator-project.interface';
import { Project } from '../../models/project.interface';
import { Client } from '../../models/client.interface';

@Component({
  selector: 'app-calculator',
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent implements OnInit, OnDestroy {
  calculatorProjects: CalculatorProject[] = [];
  allCalculatorProjects: CalculatorProject[] = [];
  paginatedProjects: CalculatorProject[] = [];

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  // Selection state
  selectedProjectIds = new Set<string>();

  // Summary
  summary: CalculatorSummary = {
    totalSelectedProjects: 0,
    totalDuration: 0,
    totalEarnings: 0
  };

  // Loading state
  isLoading = true;
  error: string | null = null;
  isMarkingPaid = false;
  successMessage: string | null = null;

  private subscription = new Subscription();

  constructor(
    private projectService: ProjectService,
    private clientService: ClientService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadCalculatorData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private loadCalculatorData() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    const projectsObs = this.projectService.getUnpaidProjectsRealtime(userId);
    const clientsObs = this.clientService.getUserClientsRealtime(userId);

    const combinedSub = combineLatest([projectsObs, clientsObs])
      .pipe(
        map(([projects, clients]) => this.processProjectsWithClients(projects, clients))
      )
      .subscribe({
        next: (calculatorProjects) => {
          this.allCalculatorProjects = calculatorProjects;
          this.calculatorProjects = [...calculatorProjects];
          this.updatePagination();
          this.updateSummary();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading calculator data:', error);
          this.error = 'Failed to load calculator data';
          this.isLoading = false;
        }
      });

    this.subscription.add(combinedSub);
  }

  private processProjectsWithClients(projects: Project[], clients: Client[]): CalculatorProject[] {
    const clientMap = new Map(clients.map(client => [client.id!, client]));

    return projects.map(project => {
      const client = project.clientId ? clientMap.get(project.clientId) : null;
      const calculatedEarnings = client ? project.duration * client.ratePerSecond : 0;
      const isSelected = this.selectedProjectIds.has(project.id!);

      return {
        ...project,
        client,
        calculatedEarnings,
        isSelected
      };
    });
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.calculatorProjects.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages));

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProjects = this.calculatorProjects.slice(startIndex, endIndex);
  }

  private updateSummary() {
    const selectedProjects = this.calculatorProjects.filter(p => this.selectedProjectIds.has(p.id!));

    this.summary = {
      totalSelectedProjects: selectedProjects.length,
      totalDuration: selectedProjects.reduce((sum, p) => sum + p.duration, 0),
      totalEarnings: selectedProjects.reduce((sum, p) => sum + p.calculatedEarnings, 0)
    };
  }

  // Pagination methods
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  getPaginationRange(): number[] {
    const range = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  // Selection methods
  toggleProjectSelection(projectId: string) {
    if (this.selectedProjectIds.has(projectId)) {
      this.selectedProjectIds.delete(projectId);
    } else {
      this.selectedProjectIds.add(projectId);
    }

    // Update the isSelected property for all projects
    this.calculatorProjects = this.calculatorProjects.map(p => ({
      ...p,
      isSelected: this.selectedProjectIds.has(p.id!)
    }));

    this.updatePagination();
    this.updateSummary();
  }

  toggleSelectAll() {
    const allSelected = this.calculatorProjects.every(p => this.selectedProjectIds.has(p.id!));

    if (allSelected) {
      // Deselect all
      this.selectedProjectIds.clear();
    } else {
      // Select all
      this.calculatorProjects.forEach(p => this.selectedProjectIds.add(p.id!));
    }

    // Update the isSelected property for all projects
    this.calculatorProjects = this.calculatorProjects.map(p => ({
      ...p,
      isSelected: this.selectedProjectIds.has(p.id!)
    }));

    this.updatePagination();
    this.updateSummary();
  }

  isAllSelected(): boolean {
    return this.calculatorProjects.length > 0 &&
      this.calculatorProjects.every(p => this.selectedProjectIds.has(p.id!));
  }

  isPartiallySelected(): boolean {
    const selectedCount = this.calculatorProjects.filter(p => this.selectedProjectIds.has(p.id!)).length;
    return selectedCount > 0 && selectedCount < this.calculatorProjects.length;
  }

  // Utility methods
  Math = Math; // Expose Math to template

  formatDuration(seconds: number): string {
    if (seconds === 0) return '0s';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  // Mark selected projects as paid
  async markSelectedProjectsAsPaid(): Promise<void> {
    if (this.selectedProjectIds.size === 0) {
      return;
    }

    try {
      this.isMarkingPaid = true;
      this.error = null;
      this.successMessage = null;

      // Get the IDs of selected projects
      const selectedIds = Array.from(this.selectedProjectIds);

      // Update each selected project to paid status
      const updatePromises = selectedIds.map(projectId =>
        this.projectService.updateProject(projectId, { status: 'paid' })
      );

      await Promise.all(updatePromises);

      // Clear selections since these projects will no longer appear in the unpaid list
      this.selectedProjectIds.clear();

      // Show success message
      this.successMessage = `Successfully marked ${selectedIds.length} project${selectedIds.length !== 1 ? 's' : ''} as paid!`;

      // Clear success message after 5 seconds
      setTimeout(() => {
        this.successMessage = null;
      }, 5000);

    } catch (error) {
      console.error('Error marking projects as paid:', error);
      this.error = 'Failed to mark projects as paid. Please try again.';
    } finally {
      this.isMarkingPaid = false;
    }
  }

  hasSelectedProjects(): boolean {
    return this.selectedProjectIds.size > 0;
  }

  clearMessages(): void {
    this.error = null;
    this.successMessage = null;
  }
}
