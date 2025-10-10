export interface Project {
    id?: string;
    name: string;
    fileName: string;
    duration: number;
    description?: string;
    status: 'paid' | 'unpaid';
    createdAt?: Date | any;
    updatedAt?: Date | any;
    userId: string;
}                                   