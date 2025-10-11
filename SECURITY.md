# 🔒 SECURITY GUIDE - Ark Studio

## ⚠️ CRITICAL: Files That Must NEVER Be Committed

### 🚫 Never Commit These Files:

- `.env` (contains real Firebase keys)
- `client/src/environments/environment.ts` (contains real Firebase config)
- `client/src/environments/environment.prod.ts` (contains real Firebase config)
- `firebase-adminsdk*.json` (Firebase Admin SDK private keys)
- `*service-account*.json` (Service account keys)

### ✅ Safe to Commit:

- `.env.example` (template with placeholders)
- `environment.example.ts` (template files)
- `firebase.json` (Firebase project configuration)
- `firestore.rules` (Firestore security rules)
- `firestore.indexes.json` (Database indexes)
- `.firebaserc` (Project aliases)

## 🛠️ Setup Instructions for New Developers

### 1. Clone Repository

```bash
git clone <repository-url>
cd Ark-Studio
```

### 2. Set Up Environment Files

```bash
# Copy environment templates
cp .env.example .env
cp client/src/environments/environment.example.ts client/src/environments/environment.ts
cp client/src/environments/environment.prod.example.ts client/src/environments/environment.prod.ts
```

### 3. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General > Your apps
4. Copy the configuration values
5. Replace placeholders in your `.env` and environment files

### 4. Install Dependencies

```bash
cd client
npm install
```

## 🚀 Deployment Security

### For Firebase Hosting:

1. Environment variables are automatically available during build
2. Never include real API keys in client-side code for public APIs
3. Use Firebase Security Rules to protect your data
4. Use the provided `deploy.sh` script for consistent deployments

#### Quick Deploy Commands:

```bash
# From the client directory:
./deploy.sh              # Automated build and deploy
# OR manually:
ng build --configuration production
firebase deploy --only hosting
```

### For Other Hosting Platforms:

Set these environment variables in your hosting platform:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

## 🔍 Security Checklist Before Deploy

- [ ] `.env` is in `.gitignore`
- [ ] Environment files with real keys are in `.gitignore`
- [ ] No hardcoded API keys in source code
- [ ] Firebase Security Rules are properly configured
- [ ] Only necessary files are committed to git
- [ ] Service account keys are never committed

## ℹ️ Firebase Client API Keys

**Note**: Firebase client-side API keys are safe to expose in client applications. They identify your Firebase project but don't grant access to your data. Access is controlled by:

1. **Authentication** (who can sign in)
2. **Security Rules** (what authenticated users can access)
3. **Domain restrictions** (which domains can use the API key)

However, we still protect them to follow security best practices and prevent misuse.
