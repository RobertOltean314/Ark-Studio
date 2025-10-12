import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeTrackingService } from '../../services/time-tracking.service';
import { AuthService } from '../../auth/auth.service';
import { TimeEntry } from '../../models/time-entry.interface';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-clocking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clocking.component.html',
  styleUrl: './clocking.component.css'
})
export class ClockingComponent implements OnInit, OnDestroy {
  currentEntry: TimeEntry | null = null;
  currentTime = new Date();
  sessionTime = 0;
  totalWorkTimeToday = 0;
  loading = false;

  timeEntries: TimeEntry[] = [];
  loadingHistory = false;
  currentPage = 1;
  pageSize = 10;
  hasMorePages = true;
  lastDoc: any = null;

  // Update/Edit functionality
  showUpdateModal = false;
  showCreateModal = false;
  editingEntry: Partial<TimeEntry> = {};
  newEntry: Partial<TimeEntry> = {};
  updating = false;

  private entrySubscription?: Subscription;
  private clockSubscription?: Subscription;
  private sessionTimerSubscription?: Subscription;

  constructor(
    private timeTrackingService: TimeTrackingService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.startClock();
    this.loadTodayEntry();
    this.loadHistory();
    this.loadTotalWorkTimeToday();
  }

  ngOnDestroy() {
    if (this.entrySubscription) {
      this.entrySubscription.unsubscribe();
    }
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
    if (this.sessionTimerSubscription) {
      this.sessionTimerSubscription.unsubscribe();
    }
  }

  startClock() {
    this.clockSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
      if (this.currentEntry && (this.currentEntry.status === 'clocked-in' || this.currentEntry.status === 'on-break')) {
        this.sessionTime = this.timeTrackingService.calculateCurrentSessionTime(this.currentEntry);
      }
      this.updateTotalWorkTimeToday();
    });
  }

  async loadTotalWorkTimeToday() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    try {
      this.totalWorkTimeToday = await this.timeTrackingService.getTotalWorkTimeToday(userId);
    } catch (error) {
      console.error('Error loading total work time today:', error);
    }
  }

  async updateTotalWorkTimeToday() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    try {
      this.totalWorkTimeToday = await this.timeTrackingService.getTotalWorkTimeToday(userId);
    } catch (error) {
      console.error('Error updating total work time today:', error);
    }
  }

  loadTodayEntry() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.entrySubscription = this.timeTrackingService.getActiveEntryRealtime(userId)
      .subscribe({
        next: (entry) => {
          this.currentEntry = entry;
          if (entry && (entry.status === 'clocked-in' || entry.status === 'on-break')) {
            this.sessionTime = this.timeTrackingService.calculateCurrentSessionTime(entry);
          } else {
            this.sessionTime = 0;
          }
        },
        error: (error) => {
          console.error('Error loading active entry:', error);
        }
      });
  }

  async loadHistory(loadMore: boolean = false) {
    if (this.loadingHistory) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loadingHistory = true;

    try {
      const result = await this.timeTrackingService.getUserTimeEntries(
        userId,
        this.pageSize,
        loadMore ? this.lastDoc : undefined
      );

      if (loadMore) {
        this.timeEntries = [...this.timeEntries, ...result.entries];
      } else {
        this.timeEntries = result.entries;
      }

      this.lastDoc = result.lastDoc;
      this.hasMorePages = result.entries.length === this.pageSize;

      if (!loadMore) {
        this.currentPage = 1;
      } else {
        this.currentPage++;
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      this.loadingHistory = false;
    }
  }

  async clockIn() {
    if (this.loading) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loading = true;
    try {
      await this.timeTrackingService.clockIn(userId);
      this.loadHistory();
      this.loadTotalWorkTimeToday();
    } catch (error) {
      console.error('Error clocking in:', error);
      alert(error instanceof Error ? error.message : 'Error clocking in');
    } finally {
      this.loading = false;
    }
  }

  async startBreak() {
    if (this.loading) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loading = true;
    try {
      await this.timeTrackingService.startBreak(userId);
    } catch (error) {
      console.error('Error starting break:', error);
      alert(error instanceof Error ? error.message : 'Error starting break');
    } finally {
      this.loading = false;
    }
  }

  async endBreak() {
    if (this.loading) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loading = true;
    try {
      await this.timeTrackingService.endBreak(userId);
    } catch (error) {
      console.error('Error ending break:', error);
      alert(error instanceof Error ? error.message : 'Error ending break');
    } finally {
      this.loading = false;
    }
  }

  async clockOut() {
    if (this.loading) return;

    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loading = true;
    try {
      await this.timeTrackingService.clockOut(userId);
      this.loadHistory();
      this.loadTotalWorkTimeToday();
    } catch (error) {
      console.error('Error clocking out:', error);
      alert(error instanceof Error ? error.message : 'Error clocking out');
    } finally {
      this.loading = false;
    }
  }

  loadMoreEntries() {
    if (this.hasMorePages && !this.loadingHistory) {
      this.loadHistory(true);
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatDuration(seconds: number): string {
    return this.timeTrackingService.formatDuration(seconds);
  }

  formatMinutes(minutes: number): string {
    return this.timeTrackingService.formatMinutes(minutes);
  }

  formatSeconds(seconds: number): string {
    return this.timeTrackingService.formatDuration(seconds);
  }

  formatWorkTime(workTime: number): string {
    if (workTime < 600 && workTime > 0) {
      return this.timeTrackingService.formatDuration(workTime);
    } else if (workTime >= 600) {
      return this.timeTrackingService.formatDuration(workTime);
    } else {
      return this.timeTrackingService.formatDuration(workTime);
    }
  }

  formatBreakTime(breakTime: number): string {
    if (breakTime < 600 && breakTime > 0) {
      return this.timeTrackingService.formatDuration(breakTime);
    } else if (breakTime >= 600) {
      return this.timeTrackingService.formatDuration(breakTime);
    } else {
      return this.timeTrackingService.formatDuration(breakTime);
    }
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

  getStatusColor(status: string): string {
    switch (status) {
      case 'clocked-in': return 'bg-green-100 text-green-800';
      case 'on-break': return 'bg-yellow-100 text-yellow-800';
      case 'clocked-out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'clocked-in': return 'Working';
      case 'on-break': return 'On Break';
      case 'clocked-out': return 'Clocked Out';
      default: return status;
    }
  }

  // Update/Edit functionality methods
  openUpdateModal(entry: TimeEntry): void {
    if (entry.status === 'clocked-in' || entry.status === 'on-break') {
      alert('Cannot edit active session. Please clock out first.');
      return;
    }

    this.editingEntry = {
      ...entry,
      clockInTime: entry.clockInTime ? this.formatDateTimeLocal(this.toDate(entry.clockInTime)) : '',
      clockOutTime: entry.clockOutTime ? this.formatDateTimeLocal(this.toDate(entry.clockOutTime)) : '',
      totalBreakTime: entry.totalBreakTime || 0
    };
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.editingEntry = {};
  }

  openCreateModal(): void {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));

    this.newEntry = {
      clockInTime: this.formatDateTimeLocal(oneHourAgo),
      clockOutTime: this.formatDateTimeLocal(now),
      totalBreakTime: 0
    };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newEntry = {};
  }

  async updateTimeEntry(): Promise<void> {
    if (!this.editingEntry.id || !this.editingEntry.clockInTime || !this.editingEntry.clockOutTime) {
      alert('Please fill in all required fields.');
      return;
    }

    const clockInTime = new Date(this.editingEntry.clockInTime as string);
    const clockOutTime = new Date(this.editingEntry.clockOutTime as string);

    if (clockOutTime <= clockInTime) {
      alert('Clock out time must be after clock in time.');
      return;
    }

    if (this.editingEntry.totalBreakTime! < 0) {
      alert('Break time cannot be negative.');
      return;
    }

    this.updating = true;
    try {
      await this.timeTrackingService.updateTimeEntry(this.editingEntry.id, {
        clockInTime,
        clockOutTime,
        totalBreakTime: this.editingEntry.totalBreakTime || 0
      });

      this.closeUpdateModal();
      this.loadHistory();
      this.loadTotalWorkTimeToday();
      alert('Time entry updated successfully!');
    } catch (error) {
      console.error('Error updating time entry:', error);
      alert('Error updating time entry. Please try again.');
    } finally {
      this.updating = false;
    }
  }

  async createTimeEntry(): Promise<void> {
    if (!this.newEntry.clockInTime || !this.newEntry.clockOutTime) {
      alert('Please fill in all required fields.');
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) return;

    const clockInTime = new Date(this.newEntry.clockInTime as string);
    const clockOutTime = new Date(this.newEntry.clockOutTime as string);

    if (clockOutTime <= clockInTime) {
      alert('Clock out time must be after clock in time.');
      return;
    }

    if (this.newEntry.totalBreakTime! < 0) {
      alert('Break time cannot be negative.');
      return;
    }

    this.updating = true;
    try {
      await this.timeTrackingService.createManualTimeEntry(
        userId,
        clockInTime,
        clockOutTime,
        this.newEntry.totalBreakTime || 0
      );

      this.closeCreateModal();
      this.loadHistory();
      this.loadTotalWorkTimeToday();
      alert('Time entry created successfully!');
    } catch (error) {
      console.error('Error creating time entry:', error);
      alert('Error creating time entry. Please try again.');
    } finally {
      this.updating = false;
    }
  }

  async deleteTimeEntry(entryId: string): Promise<void> {
    if (!confirm('Are you sure you want to delete this time entry? This action cannot be undone.')) {
      return;
    }

    try {
      await this.timeTrackingService.deleteTimeEntry(entryId);
      this.loadHistory();
      this.loadTotalWorkTimeToday();
      alert('Time entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting time entry:', error);
      alert('Error deleting time entry. Please try again.');
    }
  }

  private formatDateTimeLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  formatBreakTimeForInput(seconds: number): number {
    return Math.round(seconds / 60); // Convert seconds to minutes for input
  }

  formatBreakTimeFromInput(minutes: number): number {
    return minutes * 60; // Convert minutes back to seconds
  }

  onBreakTimeChange(minutes: number, isEdit: boolean = false): void {
    const breakTimeInSeconds = this.formatBreakTimeFromInput(minutes || 0);
    if (isEdit) {
      this.editingEntry.totalBreakTime = breakTimeInSeconds;
    } else {
      this.newEntry.totalBreakTime = breakTimeInSeconds;
    }
  }
}
