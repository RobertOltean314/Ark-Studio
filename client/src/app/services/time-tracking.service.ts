import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    onSnapshot,
    DocumentData,
    QuerySnapshot,
    Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TimeEntry, WorkSession } from '../models/time-entry.interface';

@Injectable({
    providedIn: 'root'
})
export class TimeTrackingService {
    private firestore = inject(Firestore);
    private injector = inject(Injector);

    // Get today's date in YYYY-MM-DD format
    private getTodayString(): string {
        return new Date().toISOString().split('T')[0];
    }

    // Get or create today's time entry for user (gets the first entry for today)
    async getTodayEntry(userId: string): Promise<TimeEntry | null> {
        try {
            const today = this.getTodayString();
            const entriesCollection = runInInjectionContext(this.injector, () => collection(this.firestore, 'timeEntries'));
            const q = runInInjectionContext(this.injector, () => query(
                entriesCollection,
                where('userId', '==', userId),
                where('date', '==', today),
                orderBy('createdAt', 'desc'),
                limit(1)
            ));

            const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(q));

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() } as TimeEntry;
            }

            return null;
        } catch (error) {
            console.error('Error getting today entry:', error);
            throw error;
        }
    }

    // Get currently active entry (clocked-in or on-break status)
    async getActiveEntry(userId: string): Promise<TimeEntry | null> {
        try {
            const entriesCollection = runInInjectionContext(this.injector, () => collection(this.firestore, 'timeEntries'));
            const q = runInInjectionContext(this.injector, () => query(
                entriesCollection,
                where('userId', '==', userId),
                where('status', 'in', ['clocked-in', 'on-break'])
            ));

            const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(q));

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() } as TimeEntry;
            }

            return null;
        } catch (error) {
            console.error('Error getting active entry:', error);
            throw error;
        }
    }

    // Get all entries for today for a user
    async getAllTodayEntries(userId: string): Promise<TimeEntry[]> {
        try {
            const today = this.getTodayString();
            const entriesCollection = runInInjectionContext(this.injector, () => collection(this.firestore, 'timeEntries'));
            const q = runInInjectionContext(this.injector, () => query(
                entriesCollection,
                where('userId', '==', userId),
                where('date', '==', today)
            ));

            const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(q));
            const entries: TimeEntry[] = [];

            querySnapshot.forEach((doc) => {
                entries.push({ id: doc.id, ...doc.data() } as TimeEntry);
            });

            // Sort entries by createdAt on the client side (ascending order for chronological display)
            entries.sort((a, b) => {
                const dateA = this.toDate(a.createdAt);
                const dateB = this.toDate(b.createdAt);
                return dateA.getTime() - dateB.getTime();
            });

            return entries;
        } catch (error) {
            console.error('Error getting all today entries:', error);
            throw error;
        }
    }

    // Clock in - Always creates a new session entry
    async clockIn(userId: string): Promise<void> {
        try {
            const today = this.getTodayString();
            const activeEntry = await this.getActiveEntry(userId);

            if (activeEntry) {
                throw new Error('Already clocked in. Please clock out first.');
            }

            // Always create new entry for each clock-in session
            const entriesCollection = runInInjectionContext(this.injector, () => collection(this.firestore, 'timeEntries'));
            await runInInjectionContext(this.injector, () => addDoc(entriesCollection, {
                userId,
                date: today,
                clockInTime: new Date(),
                status: 'clocked-in',
                totalBreakTime: 0, // in seconds
                totalWorkTime: 0,  // in seconds
                createdAt: new Date(),
                updatedAt: new Date()
            }));
        } catch (error) {
            console.error('Error clocking in:', error);
            throw error;
        }
    }

    // Start break
    async startBreak(userId: string): Promise<void> {
        try {
            const entry = await this.getActiveEntry(userId);
            if (!entry || entry.status !== 'clocked-in') {
                throw new Error('Must be clocked in to start break');
            }

            const docRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'timeEntries', entry.id!));
            await runInInjectionContext(this.injector, () => updateDoc(docRef, {
                breakStart: new Date(),
                status: 'on-break',
                updatedAt: new Date()
            }));
        } catch (error) {
            console.error('Error starting break:', error);
            throw error;
        }
    }

    // End break
    async endBreak(userId: string): Promise<void> {
        try {
            const entry = await this.getActiveEntry(userId);
            if (!entry || entry.status !== 'on-break') {
                throw new Error('Must be on break to end break');
            }

            const breakStart = entry.breakStart;
            const breakEnd = new Date();
            const breakDuration = Math.floor((breakEnd.getTime() - this.toDate(breakStart).getTime()) / 1000); // seconds

            const docRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'timeEntries', entry.id!));
            await runInInjectionContext(this.injector, () => updateDoc(docRef, {
                breakEnd: breakEnd,
                totalBreakTime: (entry.totalBreakTime || 0) + breakDuration,
                status: 'clocked-in',
                updatedAt: new Date()
            }));
        } catch (error) {
            console.error('Error ending break:', error);
            throw error;
        }
    }

    // Clock out
    async clockOut(userId: string): Promise<void> {
        try {
            const entry = await this.getActiveEntry(userId);
            if (!entry || entry.status === 'clocked-out') {
                throw new Error('Must be clocked in to clock out');
            }

            // If on break, end the break first
            if (entry.status === 'on-break' && entry.breakStart) {
                await this.endBreak(userId);
                // Get updated entry
                const updatedEntry = await this.getActiveEntry(userId);
                if (updatedEntry) {
                    entry.totalBreakTime = updatedEntry.totalBreakTime;
                }
            }

            const clockOutTime = new Date();
            const clockInTime = this.toDate(entry.clockInTime!);
            const totalTime = Math.floor((clockOutTime.getTime() - clockInTime.getTime()) / 1000); // seconds
            const workTime = totalTime - (entry.totalBreakTime || 0);

            const docRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'timeEntries', entry.id!));
            await runInInjectionContext(this.injector, () => updateDoc(docRef, {
                clockOutTime: clockOutTime,
                totalWorkTime: Math.max(0, workTime),
                status: 'clocked-out',
                updatedAt: new Date()
            }));
        } catch (error) {
            console.error('Error clocking out:', error);
            throw error;
        }
    }

    // Get user's time entries with pagination
    async getUserTimeEntries(userId: string, pageLimit: number = 10, lastDoc?: any): Promise<{ entries: TimeEntry[], lastDoc: any }> {
        try {
            const entriesCollection = runInInjectionContext(this.injector, () => collection(this.firestore, 'timeEntries'));
            let q = runInInjectionContext(this.injector, () => query(
                entriesCollection,
                where('userId', '==', userId),
                orderBy('date', 'desc'),
                limit(pageLimit)
            ));

            if (lastDoc) {
                q = runInInjectionContext(this.injector, () => query(
                    entriesCollection,
                    where('userId', '==', userId),
                    orderBy('date', 'desc'),
                    startAfter(lastDoc),
                    limit(pageLimit)
                ));
            }

            const querySnapshot = await runInInjectionContext(this.injector, () => getDocs(q));
            const entries: TimeEntry[] = [];

            querySnapshot.forEach((doc) => {
                entries.push({ id: doc.id, ...doc.data() } as TimeEntry);
            });

            const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

            return { entries, lastDoc: newLastDoc };
        } catch (error) {
            console.error('Error getting user time entries:', error);
            throw error;
        }
    }

    // Real-time listener for active entry
    getActiveEntryRealtime(userId: string): Observable<TimeEntry | null> {
        return new Observable(observer => {
            const entriesCollection = runInInjectionContext(this.injector, () => collection(this.firestore, 'timeEntries'));
            const q = runInInjectionContext(this.injector, () => query(
                entriesCollection,
                where('userId', '==', userId),
                where('status', 'in', ['clocked-in', 'on-break'])
            ));

            const unsubscribe = runInInjectionContext(this.injector, () =>
                onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
                    if (!querySnapshot.empty) {
                        const doc = querySnapshot.docs[0];
                        observer.next({ id: doc.id, ...doc.data() } as TimeEntry);
                    } else {
                        observer.next(null);
                    }
                }, (error) => {
                    observer.error(error);
                })
            );

            return () => unsubscribe();
        });
    }

    // Real-time listener for today's entries (all sessions for today)
    getTodayEntriesRealtime(userId: string): Observable<TimeEntry[]> {
        return new Observable(observer => {
            const today = this.getTodayString();
            const entriesCollection = runInInjectionContext(this.injector, () => collection(this.firestore, 'timeEntries'));
            const q = runInInjectionContext(this.injector, () => query(
                entriesCollection,
                where('userId', '==', userId),
                where('date', '==', today),
                orderBy('createdAt', 'asc')
            ));

            const unsubscribe = runInInjectionContext(this.injector, () =>
                onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
                    const entries: TimeEntry[] = [];
                    querySnapshot.forEach((doc) => {
                        entries.push({ id: doc.id, ...doc.data() } as TimeEntry);
                    });
                    observer.next(entries);
                }, (error) => {
                    observer.error(error);
                })
            );

            return () => unsubscribe();
        });
    }

    // Helper method to convert Firestore Timestamp to Date
    private toDate(timestamp: any): Date {
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate();
        }
        if (timestamp instanceof Date) {
            return timestamp;
        }
        return new Date(timestamp);
    }

    // Calculate current session time
    calculateCurrentSessionTime(entry: TimeEntry): number {
        if (!entry.clockInTime) return 0;

        const clockInTime = this.toDate(entry.clockInTime);
        const now = new Date();
        let totalTime = Math.floor((now.getTime() - clockInTime.getTime()) / 1000); // seconds

        // Subtract break time if currently on break
        if (entry.status === 'on-break' && entry.breakStart) {
            const breakStart = this.toDate(entry.breakStart);
            const currentBreakTime = Math.floor((now.getTime() - breakStart.getTime()) / 1000);
            totalTime -= currentBreakTime;
        }

        // Subtract previous break time (totalBreakTime is now in seconds)
        totalTime -= (entry.totalBreakTime || 0);

        return Math.max(0, totalTime);
    }

    // Format time duration in HH:MM:SS format
    formatDuration(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Format time duration in readable format (e.g., "2h 30m 45s")
    formatDurationReadable(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    }

    // Format minutes to hours and minutes (legacy support)
    formatMinutes(minutes: number): string {
        const seconds = minutes * 60;
        return this.formatDuration(seconds);
    }

    // Calculate total work time for all sessions today
    async getTotalWorkTimeToday(userId: string): Promise<number> {
        try {
            const entries = await this.getAllTodayEntries(userId);
            let totalWorkTime = 0;

            for (const entry of entries) {
                if (entry.status === 'clocked-out' && entry.totalWorkTime) {
                    totalWorkTime += entry.totalWorkTime;
                } else if (entry.status === 'clocked-in' || entry.status === 'on-break') {
                    // Calculate current session time
                    totalWorkTime += this.calculateCurrentSessionTime(entry);
                }
            }

            return totalWorkTime;
        } catch (error) {
            console.error('Error calculating total work time today:', error);
            return 0;
        }
    }
}