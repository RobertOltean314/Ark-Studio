import { Injectable, Injector, runInInjectionContext } from '@angular/core';
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
import { TimeEntry, } from '../models/time-entry.interface';

@Injectable({
    providedIn: 'root'
})
export class TimeTrackingService {
    constructor(
        private firestore: Firestore,
        private injector: Injector
    ) { }

    private getTodayString(): string {
        return new Date().toISOString().split('T')[0];
    }

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

    async clockIn(userId: string): Promise<void> {
        try {
            const today = this.getTodayString();
            const activeEntry = await this.getActiveEntry(userId);

            if (activeEntry) {
                throw new Error('Already clocked in. Please clock out first.');
            }

            const entriesCollection = runInInjectionContext(this.injector, () => collection(this.firestore, 'timeEntries'));
            await runInInjectionContext(this.injector, () => addDoc(entriesCollection, {
                userId,
                date: today,
                clockInTime: new Date(),
                status: 'clocked-in',
                totalBreakTime: 0,
                totalWorkTime: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }));
        } catch (error) {
            console.error('Error clocking in:', error);
            throw error;
        }
    }

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

    async endBreak(userId: string): Promise<void> {
        try {
            const entry = await this.getActiveEntry(userId);
            if (!entry || entry.status !== 'on-break') {
                throw new Error('Must be on break to end break');
            }

            const breakStart = entry.breakStart;
            const breakEnd = new Date();
            const breakDuration = Math.floor((breakEnd.getTime() - this.toDate(breakStart).getTime()) / 1000);

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

    async clockOut(userId: string): Promise<void> {
        try {
            const entry = await this.getActiveEntry(userId);
            if (!entry || entry.status === 'clocked-out') {
                throw new Error('Must be clocked in to clock out');
            }

            if (entry.status === 'on-break' && entry.breakStart) {
                await this.endBreak(userId);
                const updatedEntry = await this.getActiveEntry(userId);
                if (updatedEntry) {
                    entry.totalBreakTime = updatedEntry.totalBreakTime;
                }
            }

            const clockOutTime = new Date();
            const clockInTime = this.toDate(entry.clockInTime!);
            const totalTime = Math.floor((clockOutTime.getTime() - clockInTime.getTime()) / 1000);
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

    private toDate(timestamp: any): Date {
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate();
        }
        if (timestamp instanceof Date) {
            return timestamp;
        }
        return new Date(timestamp);
    }

    calculateCurrentSessionTime(entry: TimeEntry): number {
        if (!entry.clockInTime) return 0;

        const clockInTime = this.toDate(entry.clockInTime);
        const now = new Date();

        let totalTime = Math.floor((now.getTime() - clockInTime.getTime()) / 1000);
        if (entry.status === 'on-break' && entry.breakStart) {
            const breakStart = this.toDate(entry.breakStart);
            const currentBreakTime = Math.floor((now.getTime() - breakStart.getTime()) / 1000);
            totalTime -= currentBreakTime;
        }

        const previousBreakTime = entry.totalBreakTime || 0;
        totalTime -= previousBreakTime;

        return Math.max(0, totalTime);
    }

    formatDuration(seconds: number): string {
        if (!seconds || seconds < 0) return '00:00:00';

        const totalSeconds = Math.floor(Math.abs(Number(seconds)));

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

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

    formatMinutes(minutes: number): string {
        const seconds = minutes * 60;
        return this.formatDuration(seconds);
    }

    async getTotalWorkTimeToday(userId: string): Promise<number> {
        try {
            const entries = await this.getAllTodayEntries(userId);
            let totalWorkTime = 0;

            for (const entry of entries) {
                if (entry.status === 'clocked-out' && entry.totalWorkTime) {
                    totalWorkTime += entry.totalWorkTime;
                } else if (entry.status === 'clocked-in' || entry.status === 'on-break') {
                    totalWorkTime += this.calculateCurrentSessionTime(entry);
                }
            }

            return totalWorkTime;
        } catch (error) {
            console.error('Error calculating total work time today:', error);
            return 0;
        }
    }

    async updateTimeEntry(entryId: string, updates: Partial<TimeEntry>): Promise<void> {
        try {
            const docRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'timeEntries', entryId));

            // Calculate work time if clock in/out times are provided
            if (updates.clockInTime && updates.clockOutTime) {
                const clockInTime = this.toDate(updates.clockInTime);
                const clockOutTime = this.toDate(updates.clockOutTime);
                const totalTime = Math.floor((clockOutTime.getTime() - clockInTime.getTime()) / 1000);
                const workTime = totalTime - (updates.totalBreakTime || 0);
                updates.totalWorkTime = Math.max(0, workTime);
                updates.status = 'clocked-out';
            }

            await runInInjectionContext(this.injector, () => updateDoc(docRef, {
                ...updates,
                updatedAt: new Date()
            }));
        } catch (error) {
            console.error('Error updating time entry:', error);
            throw error;
        }
    }

    async deleteTimeEntry(entryId: string): Promise<void> {
        try {
            const docRef = runInInjectionContext(this.injector, () => doc(this.firestore, 'timeEntries', entryId));
            await runInInjectionContext(this.injector, () => deleteDoc(docRef));
        } catch (error) {
            console.error('Error deleting time entry:', error);
            throw error;
        }
    }

    async createManualTimeEntry(userId: string, clockInTime: Date, clockOutTime: Date, totalBreakTime: number = 0): Promise<void> {
        try {
            const date = clockInTime.toISOString().split('T')[0];
            const totalTime = Math.floor((clockOutTime.getTime() - clockInTime.getTime()) / 1000);
            const workTime = totalTime - totalBreakTime;

            const entriesCollection = runInInjectionContext(this.injector, () => collection(this.firestore, 'timeEntries'));
            await runInInjectionContext(this.injector, () => addDoc(entriesCollection, {
                userId,
                date,
                clockInTime,
                clockOutTime,
                totalBreakTime,
                totalWorkTime: Math.max(0, workTime),
                status: 'clocked-out',
                createdAt: new Date(),
                updatedAt: new Date()
            }));
        } catch (error) {
            console.error('Error creating manual time entry:', error);
            throw error;
        }
    }
}