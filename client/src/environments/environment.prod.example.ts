export const environment = {
    production: true,
    firebase: {
        apiKey: process.env['FIREBASE_API_KEY'] || 'your-api-key-here',
        authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || 'your-project.firebaseapp.com',
        projectId: process.env['FIREBASE_PROJECT_ID'] || 'your-project-id',
        storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || 'your-project.firebasestorage.app',
        messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || 'your-sender-id',
        appId: process.env['FIREBASE_APP_ID'] || 'your-app-id',
        measurementId: process.env['FIREBASE_MEASUREMENT_ID'] || 'your-measurement-id'
    }
};

// INSTRUCTIONS FOR PRODUCTION:
// 1. Copy this file to environment.prod.ts
// 2. Set environment variables in your hosting platform
// 3. Never commit the real environment.prod.ts file