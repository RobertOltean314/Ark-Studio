import { Injectable } from '@angular/core';
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

    constructor(private firestore: Firestore) { }

    // Get today's date in YYYY-MM-DD format
    private getTodayString(): string {
        return new Date().toISOString().split('T')[0];
    }

    // Get or create today's time entry for user
    async getTodayEntry(userId: string): Promise<TimeEntry | null> {
        try {
            const today = this.getTodayString();
            const entriesCollection = collection(this.firestore, 'timeEntries');
            const q = query(
                entriesCollection,
                where('userId', '==', userId),
                where('date', '==', today)
            );

            const querySnapshot = await getDocs(q);

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

    // Clock in
    async clockIn(userId: string): Promise<void> {
        try {
            const today = this.getTodayString();
            const existingEntry = await this.getTodayEntry(userId);

            if (existingEntry && existingEntry.status === 'clocked-in') {
                throw new Error('Already clocked in');
            }

            if (existingEntry) {
                // Update existing entry
                const docRef = doc(this.firestore, 'timeEntries', existingEntry.id!);
                await updateDoc(docRef, {
                    clockInTime: new Date(),
                    status: 'clocked-in',
                    updatedAt: new Date()
                });
            } else {
                // Create new entry
                const entriesCollection = collection(this.firestore, 'timeEntries');
                await addDoc(entriesCollection, {
                    userId,
                    date: today,
                    clockInTime: new Date(),
                    status: 'clocked-in',
                    totalBreakTime: 0,
                    totalWorkTime: 0,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        } catch (error) {
            console.error('Error clocking in:', error);
            throw error;
        }
    }

    // Start break
    async startBreak(userId: string): Promise<void> {
        try {
            const entry = await this.getTodayEntry(userId);
            if (!entry || entry.status !== 'clocked-in') {
                throw new Error('Must be clocked in to start break');
            }

            const docRef = doc(this.firestore, 'timeEntries', entry.id!);
            await updateDoc(docRef, {
                breakStart: new Date(),
                status: 'on-break',
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error starting break:', error);
            throw error;
        }
    }

    // End break
    async endBreak(userId: string): Promise<void> {
        try {
            const entry = await this.getTodayEntry(userId);
            if (!entry || entry.status !== 'on-break') {
                throw new Error('Must be on break to end break');
            }

            const breakStart = entry.breakStart;
            const breakEnd = new Date();
            const breakDuration = Math.floor((breakEnd.getTime() - this.toDate(breakStart).getTime()) / (1000 * 60)); // minutes

            const docRef = doc(this.firestore, 'timeEntries', entry.id!);
            await updateDoc(docRef, {
                breakEnd: breakEnd,
                totalBreakTime: (entry.totalBreakTime || 0) + breakDuration,
                status: 'clocked-in',
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error ending break:', error);
            throw error;
        }
    }

    // Clock out
    async clockOut(userId: string): Promise<void> {
        try {
            const entry = await this.getTodayEntry(userId);
            if (!entry || entry.status === 'clocked-out') {
                throw new Error('Must be clocked in to clock out');
            }

            // If on break, end the break first
            if (entry.status === 'on-break' && entry.breakStart) {
                await this.endBreak(userId);
                // Get updated entry
                const updatedEntry = await this.getTodayEntry(userId);
                if (updatedEntry) {
                    entry.totalBreakTime = updatedEntry.totalBreakTime;
                }
            }

            const clockOutTime = new Date();
            const clockInTime = this.toDate(entry.clockInTime!);
            const totalTime = Math.floor((clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60)); // minutes
            const workTime = totalTime - (entry.totalBreakTime || 0);

            const docRef = doc(this.firestore, 'timeEntries', entry.id!);
            await updateDoc(docRef, {
                clockOutTime: clockOutTime,
                totalWorkTime: workTime,
                status: 'clocked-out',
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error clocking out:', error);
            throw error;
        }
    }

    // Get user's time entries with pagination
    async getUserTimeEntries(userId: string, pageLimit: number = 10, lastDoc?: any): Promise<{ entries: TimeEntry[], lastDoc: any }> {
        try {
            const entriesCollection = collection(this.firestore, 'timeEntries');
            let q = query(
                entriesCollection,
                where('userId', '==', userId),
                orderBy('date', 'desc'),
                limit(pageLimit)
            );

            if (lastDoc) {
                q = query(
                    entriesCollection,
                    where('userId', '==', userId),
                    orderBy('date', 'desc'),
                    startAfter(lastDoc),
                    limit(pageLimit)
                );
            }

            const querySnapshot = await getDocs(q);
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

    // Real-time listener for today's entry
    getTodayEntryRealtime(userId: string): Observable<TimeEntry | null> {
        return new Observable(observer => {
            const today = this.getTodayString();
            const entriesCollection = collection(this.firestore, 'timeEntries');
            const q = query(
                entriesCollection,
                where('userId', '==', userId),
                where('date', '==', today)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    observer.next({ id: doc.id, ...doc.data() } as TimeEntry);
                } else {
                    observer.next(null);
                }
            }, (error) => {
                observer.error(error);
            });

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

        // Subtract previous break time
        totalTime -= (entry.totalBreakTime || 0) * 60; // convert minutes to seconds

        return Math.max(0, totalTime);
    }

    // Format time duration
    formatDuration(seconds: number): string {
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

    // Format minutes to hours and minutes
    formatMinutes(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
            return `${hours}h ${mins}m`;
        } else {
            return `${mins}m`;
        }
    }
}