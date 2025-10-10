import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeTrackingService } from '../../services/time-tracking.service';
import { AuthService } from '../../auth/auth.service';
import { TimeEntry } from '../../models/time-entry.interface';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-clocking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clocking.component.html',
  styleUrl: './clocking.component.css'
})
export class ClockingComponent implements OnInit, OnDestroy {
  currentEntry: TimeEntry | null = null;
  currentTime = new Date();
  sessionTime = 0; // in seconds
  loading = false;

  // History/Pagination
  timeEntries: TimeEntry[] = [];
  loadingHistory = false;
  currentPage = 1;
  pageSize = 10;
  hasMorePages = true;
  lastDoc: any = null;

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
      if (this.currentEntry && this.currentEntry.status === 'clocked-in') {
        this.sessionTime = this.timeTrackingService.calculateCurrentSessionTime(this.currentEntry);
      }
    });
  }

  loadTodayEntry() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.entrySubscription = this.timeTrackingService.getTodayEntryRealtime(userId)
      .subscribe({
        next: (entry) => {
          this.currentEntry = entry;
          if (entry && entry.status === 'clocked-in') {
            this.sessionTime = this.timeTrackingService.calculateCurrentSessionTime(entry);
          } else {
            this.sessionTime = 0;
          }
        },
        error: (error) => {
          console.error('Error loading today entry:', error);
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
      this.loadHistory(); // Refresh history
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
      this.loadHistory(); // Refresh history
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

  // Helper methods
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
}
