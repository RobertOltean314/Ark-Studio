import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Client } from '../../models/client.interface';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  showAddForm: boolean = false;
  editingClient: Client | null = null;
  clientForm: FormGroup;

  private subscription: Subscription = new Subscription();

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.clientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      ratePerSecond: [0.4, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() {
    this.loadClients();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadClients() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.isLoading = true;
    const clientsSub = this.clientService.getUserClientsRealtime(userId).subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filterClients();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.isLoading = false;
      }
    });

    this.subscription.add(clientsSub);
  }

  filterClients() {
    if (!this.searchTerm) {
      this.filteredClients = [...this.clients];
    } else {
      this.filteredClients = this.clients.filter(client =>
        client.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onSearchChange() {
    this.filterClients();
  }

  showAddClientForm() {
    this.showAddForm = true;
    this.editingClient = null;
    this.clientForm.reset({
      name: '',
      ratePerSecond: 0.4
    });
  }

  editClient(client: Client) {
    this.editingClient = client;
    this.showAddForm = true;
    this.clientForm.patchValue(client);
  }

  cancelForm() {
    this.showAddForm = false;
    this.editingClient = null;
    this.clientForm.reset();
  }

  async onSubmit() {
    if (this.clientForm.invalid) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    const formValue = this.clientForm.value;
    const clientData = {
      ...formValue,
      userId
    };

    try {
      if (this.editingClient) {
        await this.clientService.updateClient(this.editingClient.id!, clientData);
      } else {
        await this.clientService.addClient(clientData);
      }
      this.cancelForm();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  }

  async deleteClient(client: Client) {
    if (!confirm(`Are you sure you want to delete "${client.name}"?`)) return;

    try {
      await this.clientService.deleteClient(client.id!);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      if (field.errors?.['required']) return `${fieldName} is required`;
      if (field.errors?.['email']) return 'Invalid email format';
      if (field.errors?.['minlength']) return `${fieldName} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
      if (field.errors?.['min']) return `${fieldName} must be greater than 0`;
    }
    return '';
  }
}
