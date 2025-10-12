import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { StatisticsService } from '../../services/statistics.service';
import {
  StatisticsData,
  TimeFilterPeriod,
  StatisticsError,
  LoadingStates,
  ChartColors
} from '../../models/statistics.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  imports: [CommonModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  // Chart canvas references
  @ViewChild('monthlyRevenueCanvas', { static: false }) monthlyRevenueCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('projectStatusCanvas', { static: false }) projectStatusCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('clientProfitabilityCanvas', { static: false }) clientProfitabilityCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('timeTrackingCanvas', { static: false }) timeTrackingCanvas!: ElementRef<HTMLCanvasElement>;

  // Chart instances
  private monthlyRevenueChartInstance?: Chart;
  private projectStatusChartInstance?: Chart;
  private clientProfitabilityChartInstance?: Chart;
  private timeTrackingChartInstance?: Chart;

  // Data properties
  statistics: StatisticsData | null = null;
  loading: LoadingStates = {
    overview: false,
    monthlyRevenue: false,
    projectStatus: false,
    clientProfitability: false,
    timeTracking: false
  };
  error: StatisticsError | null = null;

  // Filter properties
  selectedTimePeriod: TimeFilterPeriod['value'] = 'last30days';
  timeFilterPeriods: TimeFilterPeriod[] = [
    { label: 'Last 30 Days', value: 'last30days', days: 30 },
    { label: 'Last 3 Months', value: 'last3months', days: 90 },
    { label: 'Last 6 Months', value: 'last6months', days: 180 },
    { label: 'Last 1 Year', value: 'last1year', days: 365 },
    { label: 'All Time', value: 'alltime' }
  ];

  // Chart colors following purple theme
  chartColors: ChartColors = {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    light: '#f3f4f6',
    dark: '#1f2937'
  };

  // Chart configurations
  monthlyRevenueChart: ChartConfiguration = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Total Revenue',
          data: [],
          borderColor: this.chartColors.primary,
          backgroundColor: this.chartColors.primary + '20',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Paid Revenue',
          data: [],
          borderColor: this.chartColors.success,
          backgroundColor: this.chartColors.success + '20',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Unpaid Revenue',
          data: [],
          borderColor: this.chartColors.warning,
          backgroundColor: this.chartColors.warning + '20',
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Monthly Revenue Trend'
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value: any) {
              return '$' + Number(value).toLocaleString();
            }
          }
        }
      }
    }
  };

  projectStatusChart: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: ['Paid', 'Unpaid'],
      datasets: [{
        data: [],
        backgroundColor: [this.chartColors.success, this.chartColors.warning],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Project Status Distribution'
        },
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    }
  };

  clientProfitabilityChart: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Total Revenue',
        data: [],
        backgroundColor: this.chartColors.primary,
        borderColor: this.chartColors.primary,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Client Profitability'
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value: any) {
              return '$' + Number(value).toLocaleString();
            }
          }
        }
      }
    }
  };

  timeTrackingChart: ChartConfiguration = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Work Hours',
          data: [],
          borderColor: this.chartColors.primary,
          backgroundColor: this.chartColors.primary + '30',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Break Hours',
          data: [],
          borderColor: this.chartColors.info,
          backgroundColor: this.chartColors.info + '30',
          fill: true,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Daily Time Tracking'
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value: any) {
              return Number(value).toFixed(1) + 'h';
            }
          }
        }
      }
    }
  };

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit(): void {
    this.loadStatistics();
    this.subscribeToUpdates();
  }

  ngAfterViewInit(): void {
    // Charts will be initialized when data is loaded
    setTimeout(() => this.initializeCharts(), 100);
  }

  ngOnDestroy(): void {
    // Destroy chart instances
    this.destroyExistingCharts();

    this.destroy$.next();
    this.destroy$.complete();
  }

  onTimePeriodChange(): void {
    this.loadStatistics();
  }

  refreshData(): void {
    this.statisticsService.clearCache();
    this.loadStatistics();
  }

  clearError(): void {
    this.statisticsService.clearError();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  calculatePaidPercentage(): number {
    if (!this.statistics || this.statistics.totalEarnings === 0) return 0;
    const paidAmount = this.statistics.totalEarnings - this.statistics.unpaidAmount;
    return (paidAmount / this.statistics.totalEarnings) * 100;
  }

  getStatusColor(status: 'success' | 'warning' | 'danger'): string {
    switch (status) {
      case 'success': return this.chartColors.success;
      case 'warning': return this.chartColors.warning;
      case 'danger': return this.chartColors.danger;
      default: return this.chartColors.primary;
    }
  }

  private loadStatistics(): void {
    this.statisticsService.getStatistics(this.selectedTimePeriod)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.statistics = data;
          // Initialize charts first if they don't exist, then update
          setTimeout(() => {
            this.initializeCharts();
            this.updateCharts();
          }, 200);
        },
        error: (error) => {
          console.error('Error loading statistics:', error);
        }
      });
  }

  private subscribeToUpdates(): void {
    combineLatest([
      this.statisticsService.loading$,
      this.statisticsService.error$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([loading, error]) => {
        this.loading = loading;
        this.error = error;
      });
  }

  private initializeCharts(): void {
    // Destroy existing charts before creating new ones
    this.destroyExistingCharts();

    // Initialize charts with empty data - they will be updated when data loads
    this.initializeMonthlyRevenueChart();
    this.initializeProjectStatusChart();
    this.initializeClientProfitabilityChart();
    this.initializeTimeTrackingChart();
  }

  private destroyExistingCharts(): void {
    if (this.monthlyRevenueChartInstance) {
      this.monthlyRevenueChartInstance.destroy();
      this.monthlyRevenueChartInstance = undefined;
    }
    if (this.projectStatusChartInstance) {
      this.projectStatusChartInstance.destroy();
      this.projectStatusChartInstance = undefined;
    }
    if (this.clientProfitabilityChartInstance) {
      this.clientProfitabilityChartInstance.destroy();
      this.clientProfitabilityChartInstance = undefined;
    }
    if (this.timeTrackingChartInstance) {
      this.timeTrackingChartInstance.destroy();
      this.timeTrackingChartInstance = undefined;
    }
  }

  private initializeMonthlyRevenueChart(): void {
    if (this.monthlyRevenueCanvas?.nativeElement && !this.monthlyRevenueChartInstance) {
      const ctx = this.monthlyRevenueCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.monthlyRevenueChartInstance = new Chart(ctx, this.monthlyRevenueChart);
      }
    }
  }

  private initializeProjectStatusChart(): void {
    if (this.projectStatusCanvas?.nativeElement && !this.projectStatusChartInstance) {
      const ctx = this.projectStatusCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.projectStatusChartInstance = new Chart(ctx, this.projectStatusChart);
      }
    }
  }

  private initializeClientProfitabilityChart(): void {
    if (this.clientProfitabilityCanvas?.nativeElement && !this.clientProfitabilityChartInstance) {
      const ctx = this.clientProfitabilityCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.clientProfitabilityChartInstance = new Chart(ctx, this.clientProfitabilityChart);
      }
    }
  }

  private initializeTimeTrackingChart(): void {
    if (this.timeTrackingCanvas?.nativeElement && !this.timeTrackingChartInstance) {
      const ctx = this.timeTrackingCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.timeTrackingChartInstance = new Chart(ctx, this.timeTrackingChart);
      }
    }
  }

  private updateCharts(): void {
    if (!this.statistics) return;

    this.updateMonthlyRevenueChart();
    this.updateProjectStatusChart();
    this.updateClientProfitabilityChart();
    this.updateTimeTrackingChart();
  }

  private updateMonthlyRevenueChart(): void {
    if (!this.statistics || !this.monthlyRevenueChartInstance) return;

    const data = this.statistics.monthlyRevenue;
    this.monthlyRevenueChartInstance.data.labels = data.map(item => item.month);
    this.monthlyRevenueChartInstance.data.datasets[0].data = data.map(item => item.revenue);
    this.monthlyRevenueChartInstance.data.datasets[1].data = data.map(item => item.paidRevenue);
    this.monthlyRevenueChartInstance.data.datasets[2].data = data.map(item => item.unpaidRevenue);
    this.monthlyRevenueChartInstance.update();
  }

  private updateProjectStatusChart(): void {
    if (!this.statistics || !this.projectStatusChartInstance) return;

    const data = this.statistics.projectStatusData;
    this.projectStatusChartInstance.data.datasets[0].data = [data.paid, data.unpaid];
    this.projectStatusChartInstance.update();
  }

  private updateClientProfitabilityChart(): void {
    if (!this.statistics || !this.clientProfitabilityChartInstance) return;

    const data = this.statistics.clientProfitability.slice(0, 10); // Top 10 clients
    this.clientProfitabilityChartInstance.data.labels = data.map(item => item.clientName);
    this.clientProfitabilityChartInstance.data.datasets[0].data = data.map(item => item.totalRevenue);
    this.clientProfitabilityChartInstance.update();
  }

  private updateTimeTrackingChart(): void {
    if (!this.statistics || !this.timeTrackingChartInstance) return;

    const data = this.statistics.timeTrackingData.slice(-30); // Last 30 entries
    this.timeTrackingChartInstance.data.labels = data.map(item =>
      new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    this.timeTrackingChartInstance.data.datasets[0].data = data.map(item => item.workHours);
    this.timeTrackingChartInstance.data.datasets[1].data = data.map(item => item.breakHours);
    this.timeTrackingChartInstance.update();
  }
}
