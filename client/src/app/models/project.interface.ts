export interface Project {
    id?: string;
    name: string;
    fileName: string; // Original video filename
    duration: number; // Video duration in seconds (extracted from file)
    description?: string;
    status: 'paid' | 'unpaid';
    createdAt?: Date | any; // Can be Date or Firestore Timestamp
    updatedAt?: Date | any; // Can be Date or Firestore Timestamp
    userId: string;
}                                   