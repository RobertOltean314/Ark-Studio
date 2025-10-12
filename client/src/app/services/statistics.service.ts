import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    query,
    where,
    orderBy,
    getDocs,
    Timestamp,
    QueryConstraint
} from '@angular/fire/firestore';
import {
    Observable,
    BehaviorSubject,
    combineLatest,
    from,
    of,
    throwError
} from 'rxjs';
import {
    map,
    catchError,
    shareReplay,
    switchMap,
    tap
} from 'rxjs/operators';
import { User } from '@angular/fire/auth';
import { AuthService } from '../auth/auth.service';
import { Project } from '../models/project.interface';
import { Client } from '../models/client.interface';
import { TimeEntry } from '../models/time-entry.interface';
import {
    StatisticsData,
    MonthlyRevenueData,
    ProjectStatusData,
    ClientProfitabilityData,
    TimeTrackingData,
    StatisticsCache,
    TimeFilterPeriod,
    StatisticsError,
    LoadingStates
} from '../models/statistics.interface';

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    private cache: Map<string, StatisticsCache> = new Map();

    private loadingSubject = new BehaviorSubject<LoadingStates>({
        overview: false,
        monthlyRevenue: false,
        projectStatus: false,
        clientProfitability: false,
        timeTracking: false
    });

    private errorSubject = new BehaviorSubject<StatisticsError | null>(null);

    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();

    public readonly timeFilterPeriods: TimeFilterPeriod[] = [
        { label: 'Last 30 Days', value: 'last30days', days: 30 },
        { label: 'Last 3 Months', value: 'last3months', days: 90 },
        { label: 'Last 6 Months', value: 'last6months', days: 180 },
        { label: 'Last 1 Year', value: 'last1year', days: 365 },
        { label: 'All Time', value: 'alltime' }
    ];

    constructor(
        private firestore: Firestore,
        private authService: AuthService
    ) { }

    /**
     * Get comprehensive statistics data with caching
     */
    getStatistics(timePeriod: TimeFilterPeriod['value'] = 'last30days'): Observable<StatisticsData> {
        return this.authService.user$.pipe(
            switchMap((user: User | null) => {
                if (!user) {
                    return throwError(() => ({ message: 'User not authenticated', code: 'AUTH_REQUIRED', timestamp: Date.now() }));
                }

                const cacheKey = `${user.uid}_${timePeriod}`;
                const cached = this.cache.get(cacheKey);

                if (cached && Date.now() < cached.expiryTime) {
                    return of(cached.data);
                }

                this.setLoading('overview', true);

                return combineLatest([
                    this.getProjects(user.uid, timePeriod),
                    this.getClients(user.uid),
                    this.getTimeEntries(user.uid, timePeriod)
                ]).pipe(
                    map(([projects, clients, timeEntries]) => {
                        const stats = this.calculateStatistics(projects, clients, timeEntries);

                        // Cache the results
                        this.cache.set(cacheKey, {
                            data: stats,
                            timestamp: Date.now(),
                            expiryTime: Date.now() + this.CACHE_DURATION
                        });

                        return stats;
                    }),
                    tap(() => this.setLoading('overview', false)),
                    catchError(error => {
                        this.setLoading('overview', false);
                        this.handleError(error);
                        return throwError(() => error);
                    }),
                    shareReplay(1)
                );
            })
        );
    }

    /**
     * Get monthly revenue data
     */
    getMonthlyRevenue(timePeriod: TimeFilterPeriod['value'] = 'last1year'): Observable<MonthlyRevenueData[]> {
        return this.authService.user$.pipe(
            switchMap((user: User | null) => {
                if (!user) return throwError(() => ({ message: 'User not authenticated', code: 'AUTH_REQUIRED', timestamp: Date.now() }));

                this.setLoading('monthlyRevenue', true);

                return combineLatest([
                    this.getProjects(user.uid, timePeriod),
                    this.getClients(user.uid)
                ]).pipe(
                    map(([projects, clients]) => this.calculateMonthlyRevenue(projects, clients)),
                    tap(() => this.setLoading('monthlyRevenue', false)),
                    catchError(error => {
                        this.setLoading('monthlyRevenue', false);
                        this.handleError(error);
                        return throwError(() => error);
                    })
                );
            })
        );
    }

    /**
     * Get project status distribution
     */
    getProjectStatusData(timePeriod: TimeFilterPeriod['value'] = 'alltime'): Observable<ProjectStatusData> {
        return this.authService.user$.pipe(
            switchMap((user: User | null) => {
                if (!user) return throwError(() => ({ message: 'User not authenticated', code: 'AUTH_REQUIRED', timestamp: Date.now() }));

                this.setLoading('projectStatus', true);

                return this.getProjects(user.uid, timePeriod).pipe(
                    map(projects => this.calculateProjectStatusData(projects)),
                    tap(() => this.setLoading('projectStatus', false)),
                    catchError(error => {
                        this.setLoading('projectStatus', false);
                        this.handleError(error);
                        return throwError(() => error);
                    })
                );
            })
        );
    }

    /**
     * Get client profitability data
     */
    getClientProfitability(timePeriod: TimeFilterPeriod['value'] = 'last1year'): Observable<ClientProfitabilityData[]> {
        return this.authService.user$.pipe(
            switchMap((user: User | null) => {
                if (!user) return throwError(() => ({ message: 'User not authenticated', code: 'AUTH_REQUIRED', timestamp: Date.now() }));

                this.setLoading('clientProfitability', true);

                return combineLatest([
                    this.getProjects(user.uid, timePeriod),
                    this.getClients(user.uid)
                ]).pipe(
                    map(([projects, clients]) => this.calculateClientProfitability(projects, clients)),
                    tap(() => this.setLoading('clientProfitability', false)),
                    catchError(error => {
                        this.setLoading('clientProfitability', false);
                        this.handleError(error);
                        return throwError(() => error);
                    })
                );
            })
        );
    }

    /**
     * Get time tracking data
     */
    getTimeTrackingData(timePeriod: TimeFilterPeriod['value'] = 'last30days'): Observable<TimeTrackingData[]> {
        return this.authService.user$.pipe(
            switchMap((user: User | null) => {
                if (!user) return throwError(() => ({ message: 'User not authenticated', code: 'AUTH_REQUIRED', timestamp: Date.now() }));

                this.setLoading('timeTracking', true);

                return this.getTimeEntries(user.uid, timePeriod).pipe(
                    map(timeEntries => this.calculateTimeTrackingData(timeEntries)),
                    tap(() => this.setLoading('timeTracking', false)),
                    catchError(error => {
                        this.setLoading('timeTracking', false);
                        this.handleError(error);
                        return throwError(() => error);
                    })
                );
            })
        );
    }

    /**
     * Clear cache
     */
    clearCache(): void {
        this.cache.clear();
    }

    /**
     * Clear error state
     */
    clearError(): void {
        this.errorSubject.next(null);
    }

    // Private methods for data fetching
    private getProjects(userId: string, timePeriod: TimeFilterPeriod['value']): Observable<Project[]> {
        const projectsRef = collection(this.firestore, 'projects');
        let queryConstraints: QueryConstraint[] = [where('userId', '==', userId)];

        if (timePeriod !== 'alltime') {
            const cutoffDate = this.getCutoffDate(timePeriod);
            queryConstraints.push(where('createdAt', '>=', cutoffDate));
        }

        queryConstraints.push(orderBy('createdAt', 'desc'));

        const q = query(projectsRef, ...queryConstraints);

        return from(getDocs(q)).pipe(
            map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)))
        );
    }

    private getClients(userId: string): Observable<Client[]> {
        const clientsRef = collection(this.firestore, 'clients');
        const q = query(clientsRef, where('userId', '==', userId));

        return from(getDocs(q)).pipe(
            map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)))
        );
    }

    private getTimeEntries(userId: string, timePeriod: TimeFilterPeriod['value']): Observable<TimeEntry[]> {
        const timeEntriesRef = collection(this.firestore, 'timeEntries');
        let queryConstraints: QueryConstraint[] = [where('userId', '==', userId)];

        if (timePeriod !== 'alltime') {
            const cutoffDate = this.getCutoffDate(timePeriod);
            queryConstraints.push(where('createdAt', '>=', cutoffDate));
        }

        queryConstraints.push(orderBy('createdAt', 'desc'));

        const q = query(timeEntriesRef, ...queryConstraints);

        return from(getDocs(q)).pipe(
            map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimeEntry)))
        );
    }

    // Private calculation methods
    private calculateStatistics(projects: Project[], clients: Client[], timeEntries: TimeEntry[]): StatisticsData {
        const clientMap = new Map(clients.map(client => [client.id!, client]));

        let totalEarnings = 0;
        let unpaidAmount = 0;

        projects.forEach(project => {
            const client = clientMap.get(project.clientId || '');
            if (client) {
                const projectEarnings = project.duration * client.ratePerSecond;
                totalEarnings += projectEarnings;

                if (project.status === 'unpaid') {
                    unpaidAmount += projectEarnings;
                }
            }
        });

        return {
            totalEarnings,
            unpaidAmount,
            projectCount: projects.length,
            clientCount: clients.length,
            monthlyRevenue: this.calculateMonthlyRevenue(projects, clients),
            projectStatusData: this.calculateProjectStatusData(projects),
            clientProfitability: this.calculateClientProfitability(projects, clients),
            timeTrackingData: this.calculateTimeTrackingData(timeEntries)
        };
    }

    private calculateMonthlyRevenue(projects: Project[], clients: Client[]): MonthlyRevenueData[] {
        const clientMap = new Map(clients.map(client => [client.id!, client]));
        const monthlyData = new Map<string, MonthlyRevenueData>();

        projects.forEach(project => {
            const client = clientMap.get(project.clientId || '');
            if (client && project.createdAt) {
                const date = project.createdAt.toDate ? project.createdAt.toDate() : new Date(project.createdAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                const projectRevenue = project.duration * client.ratePerSecond;

                if (!monthlyData.has(monthKey)) {
                    monthlyData.set(monthKey, {
                        month: monthName,
                        year: date.getFullYear(),
                        revenue: 0,
                        paidRevenue: 0,
                        unpaidRevenue: 0
                    });
                }

                const monthData = monthlyData.get(monthKey)!;
                monthData.revenue += projectRevenue;

                if (project.status === 'paid') {
                    monthData.paidRevenue += projectRevenue;
                } else {
                    monthData.unpaidRevenue += projectRevenue;
                }
            }
        });

        return Array.from(monthlyData.values()).sort((a, b) => a.year - b.year);
    }

    private calculateProjectStatusData(projects: Project[]): ProjectStatusData {
        return projects.reduce(
            (acc, project) => {
                if (project.status === 'paid') {
                    acc.paid++;
                } else {
                    acc.unpaid++;
                }
                return acc;
            },
            { paid: 0, unpaid: 0 }
        );
    }

    private calculateClientProfitability(projects: Project[], clients: Client[]): ClientProfitabilityData[] {
        const clientMap = new Map(clients.map(client => [client.id!, client]));
        const clientStats = new Map<string, ClientProfitabilityData>();

        projects.forEach(project => {
            const client = clientMap.get(project.clientId || '');
            if (client) {
                const projectRevenue = project.duration * client.ratePerSecond;

                if (!clientStats.has(client.id!)) {
                    clientStats.set(client.id!, {
                        clientId: client.id!,
                        clientName: client.name,
                        totalRevenue: 0,
                        projectCount: 0,
                        averageProjectValue: 0
                    });
                }

                const stats = clientStats.get(client.id!)!;
                stats.totalRevenue += projectRevenue;
                stats.projectCount++;
                stats.averageProjectValue = stats.totalRevenue / stats.projectCount;
            }
        });

        return Array.from(clientStats.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
    }

    private calculateTimeTrackingData(timeEntries: TimeEntry[]): TimeTrackingData[] {
        const dailyData = new Map<string, TimeTrackingData>();

        timeEntries.forEach(entry => {
            if (!dailyData.has(entry.date)) {
                dailyData.set(entry.date, {
                    date: entry.date,
                    totalHours: 0,
                    workHours: 0,
                    breakHours: 0
                });
            }

            const dayData = dailyData.get(entry.date)!;
            dayData.workHours += entry.totalWorkTime / 3600000; // Convert from milliseconds to hours
            dayData.breakHours += entry.totalBreakTime / 3600000;
            dayData.totalHours = dayData.workHours + dayData.breakHours;
        });

        return Array.from(dailyData.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    private getCutoffDate(timePeriod: TimeFilterPeriod['value']): Timestamp {
        const days = this.timeFilterPeriods.find(p => p.value === timePeriod)?.days || 30;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return Timestamp.fromDate(cutoffDate);
    }

    private setLoading(key: keyof LoadingStates, value: boolean): void {
        const currentState = this.loadingSubject.value;
        this.loadingSubject.next({ ...currentState, [key]: value });
    }

    private handleError(error: any): void {
        const statisticsError: StatisticsError = {
            message: error.message || 'An error occurred while fetching statistics',
            code: error.code || 'UNKNOWN_ERROR',
            timestamp: Date.now()
        };

        this.errorSubject.next(statisticsError);
        console.error('Statistics Service Error:', error);
    }
}