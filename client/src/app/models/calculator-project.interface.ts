import { Project } from './project.interface';
import { Client } from './client.interface';

export interface CalculatorProject extends Project {
    client?: Client | null;
    calculatedEarnings: number;
    isSelected: boolean;
}

export interface CalculatorSummary {
    totalSelectedProjects: number;
    totalDuration: number;
    totalEarnings: number;
}