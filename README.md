# 🏗️ Ark Studio

**Ark Studio** is a comprehensive time tracking and project management application built with Angular and Firebase. It provides freelancers and professionals with tools to track time, manage clients and projects, calculate earnings, and analyze productivity statistics.

## 🌟 Features

### 🔐 Authentication

- **Google Sign-In Integration** - Secure authentication powered by Firebase Auth
- **Protected Routes** - Auth guards to secure sensitive areas of the application

### 📊 Project Management

- **Project Creation & Management** - Create and track multiple projects
- **Project Status Tracking** - Mark projects as paid/unpaid
- **File Association** - Link files to specific projects
- **Duration Tracking** - Automatic calculation of time spent on projects

### 👥 Client Management

- **Client Profiles** - Manage client information and contact details
- **Rate Management** - Set custom hourly/per-second rates for each client
- **Project-Client Relationships** - Link projects to specific clients

### ⏰ Time Tracking

- **Clock In/Out System** - Simple time tracking with clock in/out functionality
- **Break Management** - Track break times separately from work time
- **Work Sessions** - Detailed session tracking with multiple clock-in periods per day
- **Real-time Status** - Track current status (clocked-in, on-break, clocked-out)

### 🧮 Calculator

- **Earnings Calculator** - Calculate project earnings based on time and rates
- **Multi-rate Support** - Handle different rates for different clients/projects

### 📈 Statistics & Analytics

- **Work Time Analytics** - Visualize work patterns and productivity
- **Earnings Reports** - Track income across projects and time periods
- **Chart Integration** - Visual charts powered by Chart.js and ng2-charts

### 💫 User Experience

- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern UI** - Built with Tailwind CSS for a clean, professional look
- **Smooth Animations** - Enhanced user experience with Angular animations
- **Inspirational Quotes** - Motivational quotes to keep you inspired

## 🛠️ Technology Stack

### Frontend

- **Angular 19.2** - Modern TypeScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js & ng2-charts** - Data visualization
- **Angular Animations** - Smooth UI transitions

### Backend & Database

- **Firebase** - Complete backend solution
  - **Firestore** - NoSQL database for data storage
  - **Firebase Auth** - User authentication
  - **Firebase Hosting** - Application hosting

### Development & Deployment

- **TypeScript** - Type-safe development
- **Angular CLI** - Development tooling
- **Docker** - Containerized development environment
- **Firebase CLI** - Deployment automation

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+ recommended)
- Angular CLI (`npm install -g @angular/cli`)
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RobertOltean314/Ark-Studio.git
   cd Ark-Studio
   ```

2. **Set up environment files**

   ```bash
   # Copy environment templates
   cp .env.example .env
   cp client/src/environments/environment.example.ts client/src/environments/environment.ts
   cp client/src/environments/environment.prod.example.ts client/src/environments/environment.prod.ts
   ```

3. **Configure Firebase**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Get your Firebase configuration from Project Settings
   - Replace placeholders in your environment files

4. **Install dependencies**

   ```bash
   cd client
   npm install
   ```

5. **Start development server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`

## 🐳 Docker Development

For a containerized development environment:

```bash
# Start the development environment
docker-compose up

# The application will be available at http://localhost:4200
```

## 📱 Application Structure

### Main Components

- **Welcome Component** - Landing page with authentication
- **Projects Component** - Project management interface
- **Clients Component** - Client management system
- **Clocking Component** - Time tracking controls
- **Calculator Component** - Earnings calculation tools
- **Stats Component** - Analytics and reporting dashboard

### Data Models

```typescript
// Project structure
interface Project {
  id?: string;
  name: string;
  fileName: string;
  duration: number;
  description?: string;
  status: "paid" | "unpaid";
  clientId?: string;
  userId: string;
}

// Client structure
interface Client {
  id?: string;
  name: string;
  ratePerSecond: number;
  userId: string;
}

// Time tracking structure
interface TimeEntry {
  id?: string;
  userId: string;
  date: string;
  clockInTime?: Date;
  clockOutTime?: Date;
  totalWorkTime: number;
  totalBreakTime: number;
  status: "clocked-in" | "on-break" | "clocked-out";
}
```

## 🚀 Deployment

### Automated Deployment

Use the provided deployment script for easy deployment:

```bash
cd client
./deploy.sh
```

### Manual Deployment

```bash
# Build for production
ng build --configuration production

# Deploy to Firebase
firebase deploy --only hosting
```

### Environment Variables

Set these environment variables in your hosting platform:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

## 🧪 Testing

```bash
# Run unit tests
ng test

# Run end-to-end tests
ng e2e

# Build and test production build
ng build --configuration production
```

## 📊 Development Commands

```bash
# Start development server
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test

# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name

# Lint code
ng lint
```

## 🔒 Security Guide

### 🚫 Files That Must NEVER Be Committed

- `.env` (contains real Firebase keys)
- `client/src/environments/environment.ts` (contains real Firebase config)
- `client/src/environments/environment.prod.ts` (contains real Firebase config)
- `firebase-adminsdk*.json` (Firebase Admin SDK private keys)
- `*service-account*.json` (Service account keys)

### ✅ Safe to Commit

- `.env.example` (template with placeholders)
- `environment.example.ts` (template files)
- `firebase.json` (Firebase project configuration)
- `firestore.rules` (Firestore security rules)
- `firestore.indexes.json` (Database indexes)
- `.firebaserc` (Project aliases)

### Security Checklist Before Deploy

- [ ] `.env` is in `.gitignore`
- [ ] Environment files with real keys are in `.gitignore`
- [ ] No hardcoded API keys in source code
- [ ] Firebase Security Rules are properly configured
- [ ] Only necessary files are committed to git
- [ ] Service account keys are never committed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Application**: [https://ark-studio-88515.web.app](https://ark-studio-88515.web.app)
- **Repository**: [https://github.com/RobertOltean314/Ark-Studio](https://github.com/RobertOltean314/Ark-Studio)

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the existing [Issues](https://github.com/RobertOltean314/Ark-Studio/issues)
2. Create a new issue with detailed information
3. Contact the maintainer: [@RobertOltean314](https://github.com/RobertOltean314)

---

**Built with ❤️ by [Robert Oltean](https://github.com/RobertOltean314)**

_Empowering professionals to track time, manage projects, and maximize productivity._
