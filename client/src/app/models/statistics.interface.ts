export interface StatisticsData {
    totalEarnings: number;
    unpaidAmount: number;
    projectCount: number;
    clientCount: number;
    monthlyRevenue: MonthlyRevenueData[];
    projectStatusData: ProjectStatusData;
    clientProfitability: ClientProfitabilityData[];
    timeTrackingData: TimeTrackingData[];
}

export interface MonthlyRevenueData {
    month: string;
    year: number;
    revenue: number;
    paidRevenue: number;
    unpaidRevenue: number;
}

export interface ProjectStatusData {
    paid: number;
    unpaid: number;
}

export interface ClientProfitabilityData {
    clientId: string;
    clientName: string;
    totalRevenue: number;
    projectCount: number;
    averageProjectValue: number;
}

export interface TimeTrackingData {
    date: string;
    totalHours: number;
    workHours: number;
    breakHours: number;
}

export interface StatisticsCache {
    data: StatisticsData;
    timestamp: number;
    expiryTime: number;
}

export interface TimeFilterPeriod {
    label: string;
    value: 'last30days' | 'last3months' | 'last6months' | 'last1year' | 'alltime';
    days?: number;
}

export interface ChartColors {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    light: string;
    dark: string;
}

export interface StatisticsError {
    message: string;
    code: string;
    timestamp: number;
}

export interface LoadingStates {
    overview: boolean;
    monthlyRevenue: boolean;
    projectStatus: boolean;
    clientProfitability: boolean;
    timeTracking: boolean;
}