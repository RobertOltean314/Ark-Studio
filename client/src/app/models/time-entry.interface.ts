export interface TimeEntry {
    id?: string;
    userId: string;
    date: string;
    clockInTime?: Date | any;
    clockOutTime?: Date | any;
    breakStart?: Date | any;
    breakEnd?: Date | any;
    totalBreakTime: number;
    totalWorkTime: number;
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
    totalWorkTime: number;
    totalBreakTime: number;
    status: 'clocked-in' | 'on-break' | 'clocked-out';
    createdAt: Date | any;
    updatedAt: Date | any;
}