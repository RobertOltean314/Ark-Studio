export interface Client {
    id?: string;
    name: string;
    ratePerSecond: number; // Rate in dollars per second
    userId: string;
}