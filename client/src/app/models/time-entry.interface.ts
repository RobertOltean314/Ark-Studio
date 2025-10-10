export interface TimeEntry {
    id?: string;
    userId: string;
    date: string; // YYYY-MM-DD format
    clockInTime?: Date | any; // Firestore Timestamp
    clockOutTime?: Date | any; // Firestore Timestamp
    breakStart?: Date | any; // Firestore Timestamp
    breakEnd?: Date | any; // Firestore Timestamp
    totalBreakTime: number; // in minutes
    totalWorkTime: number; // in minutes
    status: 'clocked-in' | 'on-break' | 'clocked-out';
    createdAt: Date | any;
    updatedAt: Date | any;
}

export interface WorkSession {
    id?: string;
    userId: string;
    date: string;
    sessions: {
        clockIn: Date | any;
        clockOut?: Date | any;
        breaks: {
            start: Date | any;
            end?: Date | any;
        }[];
    }[];
    totalWorkTime: number; // in minutes
    totalBreakTime: number; // in minutes
    status: 'clocked-in' | 'on-break' | 'clocked-out';
    createdAt: Date | any;
    updatedAt: Date | any;
}