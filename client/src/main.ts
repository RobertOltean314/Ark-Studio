import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, initializeFirestore } from '@angular/fire/firestore';
import { persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { environment } from './environments/environment';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => {
      try {
        const app = getApp();
        return initializeFirestore(app, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
          })
        });
      } catch (err: any) {
        console.warn('Failed to initialize Firestore with persistence:', err);
        const app = getApp();
        return initializeFirestore(app, {});
      }
    })
  ]
}).catch(err => console.error(err));

