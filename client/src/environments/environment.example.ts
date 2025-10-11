export const environment = {
    production: false,
    firebase: {
        apiKey: 'your-api-key-here',
        authDomain: 'your-project.firebaseapp.com',
        projectId: 'your-project-id',
        storageBucket: 'your-project.firebasestorage.app',
        messagingSenderId: 'your-sender-id',
        appId: 'your-app-id',
        measurementId: 'your-measurement-id'
    }
};

// INSTRUCTIONS FOR DEVELOPERS:
// 1. Copy this file to environment.ts
// 2. Replace all placeholder values with actual Firebase config
// 3. Never commit the real environment.ts file