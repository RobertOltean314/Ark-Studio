# 🏗️ Ark Studio - LLM Project Context

> **Purpose**: This document serves as a comprehensive context foundation for Large Language Models (LLMs) working on the Ark Studio project. It combines project architecture, coding standards, implementation patterns, and domain knowledge to enable effective AI-assisted development.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Development Persona & Standards](#development-persona--standards)
4. [Data Models & Interfaces](#data-models--interfaces)
5. [Service Layer Architecture](#service-layer-architecture)
6. [Component Patterns](#component-patterns)
7. [Firebase Integration](#firebase-integration)
8. [Security & Environment Configuration](#security--environment-configuration)
9. [Project Structure](#project-structure)
10. [Development Workflows](#development-workflows)
11. [Testing & Quality Assurance](#testing--quality-assurance)
12. [Deployment](#deployment)

---

## Project Overview

**Ark Studio** is a comprehensive time tracking and project management application designed for freelancers and professionals. It provides tools to track time, manage clients and projects, calculate earnings, and analyze productivity statistics.

### Core Features

- **Authentication**: Google Sign-In via Firebase Auth with protected routes
- **Project Management**: Create, track, and manage multiple projects with status tracking (paid/unpaid)
- **Client Management**: Manage client profiles, rates, and project relationships
- **Time Tracking**: Clock in/out system with break management and real-time session tracking
- **Earnings Calculator**: Calculate project earnings based on time and client rates
- **Statistics & Analytics**: Visual analytics with Chart.js for work patterns and income tracking
- **File Management**: Associate files with specific projects

### Key Objectives

1. **Productivity**: Help users maximize billable time and track work patterns
2. **Financial Clarity**: Provide clear earnings calculations and payment status tracking
3. **User Experience**: Deliver a responsive, intuitive interface with real-time updates
4. **Data Security**: Implement proper authentication and data isolation per user

---

## Architecture & Technology Stack

### Frontend Stack

- **Angular 19.2+** - Modern TypeScript framework
  - Standalone components architecture
  - Signals for reactive state management
  - New control flow syntax (`@if`, `@for`, `@switch`)
  - OnPush change detection strategy
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Chart.js 4.5+ & ng2-charts 8.0+** - Data visualization
- **Angular Animations** - UI transitions and effects
- **RxJS 7.8** - Reactive programming

### Backend & Infrastructure

- **Firebase Platform**:
  - **Firestore** - NoSQL database (Cloud Firestore)
  - **Firebase Auth** - Google OAuth authentication
  - **Firebase Hosting** - Static site hosting
  - **Location**: `europe-central2`
- **Docker** - Containerized development environment
- **TypeScript 5.7+** - Type-safe development

### Build & Development Tools

- **Angular CLI 19.2+** - Project scaffolding and build system
- **Firebase CLI** - Deployment and configuration
- **Jasmine & Karma** - Testing framework
- **PostCSS & Autoprefixer** - CSS processing

---

## Development Persona & Standards

### Persona

You are a dedicated Angular developer who thrives on leveraging the absolute latest features of the framework. You are currently immersed in Angular v19+, passionately adopting:

- **Signals** for reactive state management
- **Standalone components** for streamlined architecture
- **New control flow** for intuitive template logic
- **Performance optimization** through modern change detection

You value clean, efficient, and maintainable code, and are familiar with all the newest APIs and best practices.

### TypeScript Best Practices

```typescript
// ✅ DO: Use strict type checking
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ DO: Prefer type inference when obvious
const count = 5; // Type is inferred as number

// ❌ DON'T: Use 'any' type
// const data: any = fetchData();

// ✅ DO: Use 'unknown' when type is uncertain
const data: unknown = fetchData();
```

### Angular Best Practices

#### Components

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  output,
} from "@angular/core";

@Component({
  selector: "app-example",
  templateUrl: "./example.component.html",
  styleUrl: "./example.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
  // DON'T set standalone: true (it's default in Angular 19+)
})
export class ExampleComponent {
  // ✅ DO: Use input() signal for inputs
  userId = input.required<string>();

  // ✅ DO: Use output() for outputs
  itemClicked = output<string>();

  // ✅ DO: Use signal() for reactive state
  protected readonly isLoading = signal(false);
  protected readonly items = signal<Item[]>([]);

  // ✅ DO: Use computed() for derived state
  protected readonly itemCount = computed(() => this.items().length);

  // ✅ DO: Update signals with update() or set()
  toggleLoading() {
    this.isLoading.update((loading) => !loading);
  }

  addItem(item: Item) {
    this.items.update((items) => [...items, item]);
  }

  // ❌ DON'T: Use mutate on signals
  // this.items.mutate(items => items.push(item));
}
```

#### Templates

```html
<!-- ✅ DO: Use new control flow syntax -->
@if (isLoading()) {
<div>Loading...</div>
} @else {
<div>Content loaded</div>
} @for (item of items(); track item.id) {
<div>{{ item.name }}</div>
} @switch (status()) { @case ('active') { <span>Active</span> } @case
('inactive') { <span>Inactive</span> } @default { <span>Unknown</span> } }

<!-- ✅ DO: Use class bindings instead of ngClass -->
<div [class.active]="isActive()" [class.disabled]="isDisabled()">
  <!-- ✅ DO: Use style bindings instead of ngStyle -->
  <div [style.color]="textColor()" [style.font-size.px]="fontSize()">
    <!-- ❌ DON'T: Use arrow functions in templates -->
    <!-- <button (click)="() => doSomething()">Click</button> -->

    <!-- ❌ DON'T: Assume globals like 'new Date()' are available -->
    <!-- <div>{{ new Date() }}</div> -->
  </div>
</div>
```

#### Services

```typescript
import { Injectable, inject } from "@angular/core";
import { Firestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root", // ✅ DO: Use for singleton services
})
export class DataService {
  // ✅ DO: Use inject() function instead of constructor injection
  private firestore = inject(Firestore);

  // Service methods here
}
```

#### Host Bindings

```typescript
// ❌ DON'T: Use @HostBinding and @HostListener decorators
// @HostBinding('class.active') isActive = true;
// @HostListener('click') onClick() { }

// ✅ DO: Use host object in component decorator
@Component({
  selector: 'app-button',
  host: {
    '[class.active]': 'isActive()',
    '(click)': 'onClick()'
  }
})
```

### Accessibility Requirements

- **MUST** pass all AXE checks
- **MUST** follow WCAG AA minimums
- **MUST** include proper focus management
- **MUST** maintain adequate color contrast
- **MUST** use appropriate ARIA attributes

### Component Guidelines

- Keep components small and focused on a single responsibility
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Prefer inline templates for small components
- Prefer Reactive forms over Template-driven forms
- Use `NgOptimizedImage` for static images (not for inline base64)

### State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Use `update()` or `set()` instead of `mutate()`

---

## Data Models & Interfaces

### Project Interface

```typescript
export interface Project {
  id?: string;
  name: string;
  fileName: string;
  duration: number; // Duration in seconds
  description?: string;
  status: "paid" | "unpaid";
  clientId?: string; // Optional relationship to client
  createdAt?: Date | any;
  updatedAt?: Date | any;
  userId: string; // User ownership
}
```

**Purpose**: Represents a billable project with time tracking and payment status.

**Key Fields**:

- `duration`: Total time spent in seconds
- `status`: Payment status tracking
- `clientId`: Links project to client for rate calculation
- `userId`: Ensures data isolation per user

### Client Interface

```typescript
export interface Client {
  id?: string;
  name: string;
  ratePerSecond: number; // Rate in dollars per second
  userId: string;
}
```

**Purpose**: Represents a client with billing rate information.

**Key Fields**:

- `ratePerSecond`: Enables precise time-to-money calculations
- `userId`: Ensures data isolation per user

### Time Entry Interface

```typescript
export interface TimeEntry {
  id?: string;
  userId: string;
  date: string; // ISO date format (YYYY-MM-DD)
  clockInTime?: Date | any;
  clockOutTime?: Date | any;
  breakStart?: Date | any;
  breakEnd?: Date | any;
  totalBreakTime: number; // Total break time in seconds
  totalWorkTime: number; // Total work time in seconds
  status: "clocked-in" | "on-break" | "clocked-out";
  createdAt: Date | any;
  updatedAt: Date | any;
}
```

**Purpose**: Tracks daily work sessions with clock in/out and break management.

**Key Fields**:

- `date`: ISO string for daily grouping
- `status`: Current state of work session
- `totalWorkTime`: Accumulated billable time
- `totalBreakTime`: Non-billable time tracking

### Work Session Interface

```typescript
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
  status: "clocked-in" | "on-break" | "clocked-out";
  createdAt: Date | any;
  updatedAt: Date | any;
}
```

**Purpose**: Enhanced time tracking supporting multiple clock-in sessions per day.

### Statistics Interfaces

```typescript
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
  value: "last30days" | "last3months" | "last6months" | "last1year" | "alltime";
  days?: number;
}
```

**Purpose**: Comprehensive analytics and reporting data structures.

### Calculator Project Interface

```typescript
export interface CalculatorProject {
  id?: string;
  name: string;
  duration: number; // in seconds
  clientId?: string;
  rate?: number; // Override rate if specified
}
```

**Purpose**: Simplified project interface for earnings calculations.

---

## Service Layer Architecture

### AuthService

**Location**: `client/src/app/auth/auth.service.ts`

**Responsibility**: Manages user authentication via Firebase Auth with Google OAuth.

```typescript
@Injectable({ providedIn: "root" })
export class AuthService {
  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = authState(this.auth).pipe(shareReplay(1));
  }

  async googleSignIn(): Promise<void>;
  async signOut(): Promise<void>;
  isLoggedIn(): boolean;
  getUserName(): string | null;
  getUserEmail(): string | null;
  getUserId(): string | null;
}
```

**Key Methods**:

- `googleSignIn()`: Initiates Google OAuth flow with popup
- `signOut()`: Logs out current user
- `getUserId()`: Returns current user's Firebase UID for data queries
- `user$`: Observable stream of auth state changes

**Usage Pattern**:

```typescript
constructor(private authService: AuthService) {}

ngOnInit() {
  const userId = this.authService.getUserId();
  if (userId) {
    this.loadUserData(userId);
  }
}
```

### ProjectService

**Location**: `client/src/app/services/project.service.ts`

**Responsibility**: CRUD operations for projects with Firestore integration.

```typescript
@Injectable({ providedIn: "root" })
export class ProjectService {
  async addProject(project: Omit<Project, "id">): Promise<string>;
  async getProject(id: string): Promise<Project | null>;
  async getUserProjects(userId: string): Promise<Project[]>;
  getUserProjectsRealtime(userId: string): Observable<Project[]>;
  async updateProject(id: string, updates: Partial<Project>): Promise<void>;
  async deleteProject(id: string): Promise<void>;
  async getProjectsByClient(
    userId: string,
    clientId: string,
  ): Promise<Project[]>;
}
```

**Key Features**:

- Real-time updates via `getUserProjectsRealtime()`
- Automatic timestamp management (`createdAt`, `updatedAt`)
- User-scoped queries for data isolation
- Ordered by `updatedAt` descending

**Usage Pattern**:

```typescript
// Real-time subscription
this.projectService.getUserProjectsRealtime(userId).subscribe({
  next: (projects) => this.projects.set(projects),
  error: (error) => console.error("Error loading projects:", error),
});

// One-time fetch
const projects = await this.projectService.getUserProjects(userId);
```

### ClientService

**Location**: `client/src/app/services/client.service.ts`

**Responsibility**: CRUD operations for clients with rate management.

```typescript
@Injectable({ providedIn: "root" })
export class ClientService {
  async addClient(client: Omit<Client, "id">): Promise<string>;
  async getClient(id: string): Promise<Client | null>;
  async getUserClients(userId: string): Promise<Client[]>;
  getUserClientsRealtime(userId: string): Observable<Client[]>;
  async updateClient(id: string, updates: Partial<Client>): Promise<void>;
  async deleteClient(id: string): Promise<void>;
}
```

**Key Features**:

- Real-time client list updates
- Alphabetical ordering by name
- Rate-per-second storage for precise calculations

### TimeTrackingService

**Location**: `client/src/app/services/time-tracking.service.ts`

**Responsibility**: Complex time tracking logic with clock in/out, breaks, and calculations.

```typescript
@Injectable({ providedIn: "root" })
export class TimeTrackingService {
  // Entry management
  async getTodayEntry(userId: string): Promise<TimeEntry | null>;
  async getActiveEntry(userId: string): Promise<TimeEntry | null>;
  async getAllTodayEntries(userId: string): Promise<TimeEntry[]>;

  // Clock operations
  async clockIn(userId: string): Promise<string>;
  async clockOut(userId: string): Promise<void>;
  async startBreak(userId: string): Promise<void>;
  async endBreak(userId: string): Promise<void>;

  // Time calculations
  calculateCurrentSessionTime(entry: TimeEntry): number;
  async getTotalWorkTimeToday(userId: string): Promise<number>;

  // History & pagination
  async getTimeEntriesHistory(
    userId: string,
    pageSize: number,
    lastDoc?: any,
  ): Promise<{ entries: TimeEntry[]; lastDoc: any }>;

  // CRUD operations
  async createTimeEntry(entry: Omit<TimeEntry, "id">): Promise<string>;
  async updateTimeEntry(id: string, updates: Partial<TimeEntry>): Promise<void>;
  async deleteTimeEntry(id: string): Promise<void>;
}
```

**Key Features**:

- Automatic date handling (ISO format YYYY-MM-DD)
- Real-time session time calculations
- Break time tracking and accumulation
- Status management (clocked-in, on-break, clocked-out)
- Pagination support for history

**Time Calculation Logic**:

```typescript
// Calculate billable time from entry
const workTime = totalWorkTime - totalBreakTime;
```

### StatisticsService

**Location**: `client/src/app/services/statistics.service.ts`

**Responsibility**: Aggregate data analysis and reporting.

**Key Features**:

- Revenue calculations across time periods
- Client profitability analysis
- Project status breakdowns
- Time tracking analytics
- Caching for performance optimization

### FileUploadService

**Location**: `client/src/app/services/file-upload.service.ts`

**Responsibility**: File handling and association with projects.

---

## Component Patterns

### Component Structure Example

**File Structure**:

```
component-name/
├── component-name.component.ts      # Logic
├── component-name.component.html    # Template
├── component-name.component.css     # Styles
└── component-name.component.spec.ts # Tests
```

### Projects Component Pattern

**Location**: `client/src/app/components/projects/projects.component.ts`

**Pattern**: List view with CRUD operations and real-time updates.

```typescript
@Component({
  selector: "app-projects",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./projects.component.html",
  styleUrl: "./projects.component.css",
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  clients: Client[] = [];
  loading = true;
  isProcessing = false;
  showNewProjectForm = false;
  showUpdateModal = false;

  newProject: Partial<Project> = {};
  editingProject: Partial<Project> = {};

  private projectsSubscription?: Subscription;
  private clientsSubscription?: Subscription;

  constructor(
    private projectService: ProjectService,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.loadClients();
  }

  ngOnDestroy() {
    this.projectsSubscription?.unsubscribe();
    this.clientsSubscription?.unsubscribe();
  }

  loadProjects() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.projectsSubscription = this.projectService
      .getUserProjectsRealtime(userId)
      .subscribe({
        next: (projects) => {
          this.projects = projects;
          this.loading = false;
        },
        error: (error) => {
          console.error("Error loading projects:", error);
          this.loading = false;
        },
      });
  }
}
```

**Key Patterns**:

- Real-time subscriptions with cleanup in `ngOnDestroy`
- Loading states for UX feedback
- Modal-based forms for create/update operations
- User ID validation before data operations

### Clocking Component Pattern

**Location**: `client/src/app/components/clocking/clocking.component.ts`

**Pattern**: Real-time status display with interval-based updates.

```typescript
@Component({
  selector: "app-clocking",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./clocking.component.html",
  styleUrl: "./clocking.component.css",
})
export class ClockingComponent implements OnInit, OnDestroy {
  currentEntry: TimeEntry | null = null;
  currentTime = new Date();
  sessionTime = 0;
  totalWorkTimeToday = 0;
  loading = false;

  private clockSubscription?: Subscription;
  private sessionTimerSubscription?: Subscription;

  ngOnInit() {
    this.startClock();
    this.loadTodayEntry();
  }

  ngOnDestroy() {
    this.clockSubscription?.unsubscribe();
    this.sessionTimerSubscription?.unsubscribe();
  }

  startClock() {
    this.clockSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
      if (this.currentEntry?.status === "clocked-in") {
        this.sessionTime = this.timeTrackingService.calculateCurrentSessionTime(
          this.currentEntry,
        );
      }
    });
  }

  async clockIn() {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.loading = true;
    await this.timeTrackingService.clockIn(userId);
    await this.loadTodayEntry();
    this.loading = false;
  }
}
```

**Key Patterns**:

- Interval-based clock updates (1 second)
- Real-time session time calculations
- Async operation handling with loading states
- Automatic UI updates on state changes

### Welcome Component Pattern

**Location**: `client/src/app/components/welcome/welcome.component.ts`

**Pattern**: Landing page with authentication and inspirational quotes.

**Key Features**:

- Google Sign-In integration
- Quote service for motivational content
- Redirect to main app after authentication

---

## Firebase Integration

### Firestore Database Structure

```
firestore/
├── projects/
│   └── {projectId}
│       ├── id: string
│       ├── name: string
│       ├── fileName: string
│       ├── duration: number
│       ├── description: string
│       ├── status: 'paid' | 'unpaid'
│       ├── clientId: string
│       ├── userId: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── clients/
│   └── {clientId}
│       ├── id: string
│       ├── name: string
│       ├── ratePerSecond: number
│       ├── userId: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── timeEntries/
    └── {entryId}
        ├── id: string
        ├── userId: string
        ├── date: string (ISO format)
        ├── clockInTime: timestamp
        ├── clockOutTime: timestamp
        ├── breakStart: timestamp
        ├── breakEnd: timestamp
        ├── totalBreakTime: number
        ├── totalWorkTime: number
        ├── status: string
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

### Firestore Security Rules

**Location**: `client/firestore.rules`

```javascript
rules_version='2'

service cloud.firestore {
  match /databases/{database}/documents {
    // Projects: Users can only access their own projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }

    // Time Entries: Users can only access their own entries
    match /timeEntries/{entryId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }

    // Fallback rule (authenticated users only)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Security Principles**:

1. All operations require authentication
2. Users can only access their own data (userId filtering)
3. Create operations enforce userId on new documents
4. Fallback rule provides authenticated-only access

### Firebase Configuration

**Location**: `client/firebase.json`

```json
{
  "firestore": {
    "database": "(default)",
    "location": "europe-central2",
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist/client/browser",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Key Configuration**:

- Firestore location: `europe-central2`
- SPA routing via rewrites to `index.html`
- Cache headers for static assets
- CORS headers for fonts

### Query Patterns

```typescript
// Get user's projects ordered by update time
const q = query(
  collection(firestore, "projects"),
  where("userId", "==", userId),
  orderBy("updatedAt", "desc"),
);

// Get today's time entry
const q = query(
  collection(firestore, "timeEntries"),
  where("userId", "==", userId),
  where("date", "==", todayString),
  orderBy("createdAt", "desc"),
  limit(1),
);

// Real-time subscription
const unsubscribe = onSnapshot(q, (snapshot) => {
  // Handle updates
});
```

**Query Best Practices**:

- Always filter by `userId` first for security
- Use `orderBy` for consistent results
- Combine with `limit` for pagination
- Use real-time listeners for live data
- Remember to unsubscribe in `ngOnDestroy`

---

## Security & Environment Configuration

### Critical Security Rules

#### 🚫 NEVER COMMIT THESE FILES:

- `.env` (contains real Firebase keys)
- `client/src/environments/environment.ts` (real config)
- `client/src/environments/environment.prod.ts` (production config)
- `firebase-adminsdk*.json` (Admin SDK keys)
- `*service-account*.json` (Service account keys)

#### ✅ SAFE TO COMMIT:

- `.env.example` (template with placeholders)
- `environment.example.ts` (template files)
- `firebase.json` (project configuration)
- `firestore.rules` (security rules)
- `firestore.indexes.json` (database indexes)
- `.firebaserc` (project aliases)

### Environment Configuration

**Template**: `client/src/environments/environment.example.ts`

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id",
  },
};
```

**Setup Process**:

1. Copy example files to actual environment files
2. Get Firebase config from Firebase Console
3. Replace placeholders with actual values
4. Verify files are in `.gitignore`

### Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] Environment files with real keys are in `.gitignore`
- [ ] No hardcoded API keys in source code
- [ ] Firebase Security Rules are properly configured
- [ ] Service account keys never committed
- [ ] All API endpoints validate user authentication
- [ ] Data queries filter by `userId`

---

## Project Structure

```
Ark-Studio/
├── client/                              # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.*          # Root component
│   │   │   ├── app.config.ts            # Application configuration
│   │   │   ├── app.routes.ts            # Route definitions
│   │   │   ├── auth/                    # Authentication module
│   │   │   │   ├── auth.service.ts      # Firebase Auth service
│   │   │   │   └── auth-guard.ts.guard.ts # Route protection
│   │   │   ├── components/              # Feature components
│   │   │   │   ├── calculator/          # Earnings calculator
│   │   │   │   ├── clients/             # Client management
│   │   │   │   ├── clocking/            # Time tracking UI
│   │   │   │   ├── navbar/              # Navigation component
│   │   │   │   ├── projects/            # Project management
│   │   │   │   ├── stats/               # Analytics dashboard
│   │   │   │   └── welcome/             # Landing page
│   │   │   ├── models/                  # TypeScript interfaces
│   │   │   │   ├── calculator-project.interface.ts
│   │   │   │   ├── client.interface.ts
│   │   │   │   ├── project.interface.ts
│   │   │   │   ├── statistics.interface.ts
│   │   │   │   └── time-entry.interface.ts
│   │   │   └── services/                # Business logic services
│   │   │       ├── client.service.ts
│   │   │       ├── file-upload.service.ts
│   │   │       ├── project.service.ts
│   │   │       ├── statistics.service.ts
│   │   │       └── time-tracking.service.ts
│   │   ├── environments/                # Configuration files
│   │   │   ├── environment.example.ts   # Template (COMMIT)
│   │   │   ├── environment.ts           # Dev config (DON'T COMMIT)
│   │   │   ├── environment.prod.example.ts
│   │   │   └── environment.prod.ts      # Prod config (DON'T COMMIT)
│   │   ├── index.html                   # Entry HTML
│   │   ├── main.ts                      # Bootstrap file
│   │   └── styles.css                   # Global styles (Tailwind)
│   ├── angular.json                     # Angular CLI config
│   ├── package.json                     # Dependencies
│   ├── tailwind.config.js               # Tailwind configuration
│   ├── tsconfig.json                    # TypeScript config
│   ├── firebase.json                    # Firebase configuration
│   ├── firestore.rules                  # Firestore security rules
│   ├── firestore.indexes.json           # Database indexes
│   └── Dockerfile.client                # Docker configuration
├── docker-compose.yaml                  # Docker orchestration
├── apphosting.yaml                      # Firebase App Hosting config
├── README.md                            # User documentation
├── SECURITY.md                          # Security guidelines
├── LLM_PROJECT_CONTEXT.md              # This file (LLM context)
└── instructions.md                      # Development guidelines
```

### Key Directories

- **`client/src/app/auth/`**: Authentication logic and guards
- **`client/src/app/components/`**: Feature components (UI + logic)
- **`client/src/app/models/`**: TypeScript interfaces and types
- **`client/src/app/services/`**: Business logic and Firebase integration
- **`client/src/environments/`**: Environment-specific configuration

---

## Development Workflows

### Initial Setup

```bash
# 1. Clone repository
git clone https://github.com/RobertOltean314/Ark-Studio.git
cd Ark-Studio

# 2. Setup environment files
cp client/src/environments/environment.example.ts client/src/environments/environment.ts
cp client/src/environments/environment.prod.example.ts client/src/environments/environment.prod.ts

# 3. Get Firebase config from console and update environment files

# 4. Install dependencies
cd client
npm install

# 5. Start development server
ng serve
```

### Development Commands

```bash
# Start dev server (http://localhost:4200)
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test

# Generate component
ng generate component components/feature-name

# Generate service
ng generate service services/service-name

# Lint code
ng lint

# Build with watch mode
ng build --watch --configuration development
```

### Docker Development

```bash
# Start containerized environment
docker-compose up

# Access at http://localhost:4200

# Stop containers
docker-compose down
```

### Adding a New Feature

1. **Create Component**:

   ```bash
   ng generate component components/feature-name
   ```

2. **Add Route** in `app.routes.ts`:

   ```typescript
   {
     path: 'feature',
     component: FeatureComponent,
     canActivate: [authGuardTsGuard]
   }
   ```

3. **Create Service** (if needed):

   ```bash
   ng generate service services/feature
   ```

4. **Add Navigation** in navbar component

5. **Implement with Modern Angular**:
   - Use signals for state
   - Use computed for derived values
   - Use new control flow syntax
   - Set OnPush change detection

### Working with Firestore

```typescript
// 1. Add interface in models/
export interface NewModel {
  id?: string;
  userId: string;
  // ... other fields
}

// 2. Create service
@Injectable({ providedIn: 'root' })
export class NewModelService {
  private firestore = inject(Firestore);

  async create(model: Omit<NewModel, 'id'>): Promise<string> {
    const collectionRef = collection(this.firestore, 'newModels');
    const docRef = await addDoc(collectionRef, {
      ...model,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  }

  getUserModelsRealtime(userId: string): Observable<NewModel[]> {
    return new Observable(observer => {
      const q = query(
        collection(this.firestore, 'newModels'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const models = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as NewModel));
        observer.next(models);
      });

      return () => unsubscribe();
    });
  }
}

// 3. Update Firestore rules
match /newModels/{modelId} {
  allow read, write: if request.auth != null
    && request.auth.uid == resource.data.userId;
  allow create: if request.auth != null
    && request.auth.uid == request.resource.data.userId;
}
```

---

## Testing & Quality Assurance

### Unit Testing

```bash
# Run all tests
ng test

# Run with coverage
ng test --code-coverage

# Run specific test file
ng test --include='**/component-name.component.spec.ts'
```

### Test Structure

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ExampleComponent } from "./example.component";

describe("ExampleComponent", () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent], // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle state", () => {
    const initialState = component.isActive();
    component.toggle();
    expect(component.isActive()).toBe(!initialState);
  });
});
```

### Code Quality Checks

- **TypeScript strict mode**: Enabled
- **ESLint**: Enforce code style
- **Prettier**: Code formatting
- **Accessibility**: AXE compliance required

---

## Deployment

### Automated Deployment

```bash
cd client
./deploy.sh
```

### Manual Deployment

```bash
# 1. Build production bundle
ng build --configuration production

# 2. Login to Firebase (if needed)
firebase login

# 3. Deploy to hosting
firebase deploy --only hosting

# 4. Deploy Firestore rules
firebase deploy --only firestore:rules

# 5. Deploy all
firebase deploy
```

### Pre-deployment Checklist

- [ ] All tests passing (`ng test`)
- [ ] Production build successful (`ng build --configuration production`)
- [ ] Environment variables set correctly
- [ ] Firebase security rules updated
- [ ] No console errors or warnings
- [ ] Accessibility checks passed
- [ ] Performance metrics acceptable

### Environment Variables for Hosting

Set in hosting platform or Firebase environment:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

### Post-deployment Verification

1. Visit deployed URL
2. Test authentication flow
3. Verify data operations (CRUD)
4. Check real-time updates
5. Test on mobile devices
6. Verify analytics tracking

---

## Common Patterns & Solutions

### Real-time Data Subscription

```typescript
// Always clean up subscriptions
private subscription?: Subscription;

ngOnInit() {
  const userId = this.authService.getUserId();
  if (!userId) return;

  this.subscription = this.dataService.getRealtime(userId).subscribe({
    next: (data) => this.data.set(data),
    error: (error) => console.error('Error:', error)
  });
}

ngOnDestroy() {
  this.subscription?.unsubscribe();
}
```

### Loading States

```typescript
protected readonly isLoading = signal(false);

async loadData() {
  this.isLoading.set(true);
  try {
    const data = await this.service.getData();
    this.data.set(data);
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    this.isLoading.set(false);
  }
}
```

### Form Handling

```typescript
// Template
<form (ngSubmit)="onSubmit()">
  <input [(ngModel)]="formData.name" name="name" required>
  <button type="submit" [disabled]="isSubmitting()">Submit</button>
</form>

// Component
protected readonly isSubmitting = signal(false);
formData: Partial<Model> = {};

async onSubmit() {
  this.isSubmitting.set(true);
  try {
    await this.service.create(this.formData);
    this.formData = {}; // Reset form
  } catch (error) {
    console.error('Error:', error);
  } finally {
    this.isSubmitting.set(false);
  }
}
```

### Error Handling

```typescript
protected readonly errorMessage = signal<string | null>(null);

async performAction() {
  this.errorMessage.set(null);
  try {
    await this.service.doSomething();
  } catch (error) {
    if (error instanceof Error) {
      this.errorMessage.set(error.message);
    } else {
      this.errorMessage.set('An unexpected error occurred');
    }
  }
}
```

---

## Additional Resources

### Official Documentation

- **Angular**: https://angular.dev/
- **Angular Essentials**: https://angular.dev/essentials
- **Angular Signals**: https://angular.dev/guide/signals
- **Angular Style Guide**: https://angular.dev/style-guide
- **Firebase**: https://firebase.google.com/docs
- **Firestore**: https://firebase.google.com/docs/firestore
- **Tailwind CSS**: https://tailwindcss.com/docs

### Key Angular Concepts

- **Components**: https://angular.dev/essentials/components
- **Templates**: https://angular.dev/essentials/templates
- **Dependency Injection**: https://angular.dev/essentials/dependency-injection
- **Signals**: https://angular.dev/guide/signals
- **Input/Output**: https://angular.dev/guide/components/inputs

### Project Links

- **Live Application**: https://ark-studio-88515.web.app
- **Repository**: https://github.com/RobertOltean314/Ark-Studio
- **Issues**: https://github.com/RobertOltean314/Ark-Studio/issues

---

## Troubleshooting

### Common Issues

**Issue**: Firebase auth not working

- **Solution**: Verify environment.ts has correct Firebase config
- **Solution**: Check Firebase console for enabled auth providers

**Issue**: Firestore queries returning empty

- **Solution**: Verify userId is correct
- **Solution**: Check Firestore rules allow read access
- **Solution**: Confirm documents have userId field

**Issue**: Real-time updates not working

- **Solution**: Ensure subscription is not unsubscribed too early
- **Solution**: Check Firestore rules for read permissions
- **Solution**: Verify `onSnapshot` is properly configured

**Issue**: Build errors in production

- **Solution**: Clear `node_modules` and reinstall
- **Solution**: Update `@angular/cli` and dependencies
- **Solution**: Check for TypeScript strict mode errors

---

## Contributing Guidelines

### Code Style

1. Follow Angular style guide
2. Use signals for state management
3. Implement OnPush change detection
4. Write meaningful component and variable names
5. Add comments for complex logic
6. Keep functions small and focused

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: add feature description"

# 3. Push to remote
git push origin feature/feature-name

# 4. Create Pull Request on GitHub
```

### Commit Message Format

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

---

## Glossary

- **Signal**: Angular's reactive primitive for state management
- **Computed**: Derived state that automatically updates when dependencies change
- **OnPush**: Change detection strategy that only checks when inputs change or events occur
- **Firestore**: Google's NoSQL cloud database
- **Firebase Auth**: Google's authentication service
- **Time Entry**: A record of a work session with clock in/out times
- **Client Rate**: The amount charged per unit of time (stored as rate per second)
- **Project Status**: Whether a project has been paid or is still unpaid
- **Work Session**: A period of clocked-in time, excluding breaks

---

## Version Information

- **Angular**: 19.2+
- **TypeScript**: 5.7+
- **Node.js**: 18+ recommended
- **Firebase**: 11.10+
- **Tailwind CSS**: 3.4+
- **Chart.js**: 4.5+

---

**Last Updated**: February 2026
**Maintained By**: Robert Oltean (@RobertOltean314)
**Purpose**: LLM context foundation for Ark Studio development

---
