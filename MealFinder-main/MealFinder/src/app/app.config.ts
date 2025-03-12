import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';


import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app'; 
import { provideAuth } from '@angular/fire/auth'; 
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyBd34YEnwh3_nl9BsPgYgPJbQoA8Sch05w",
  authDomain: "project300-a824a.firebaseapp.com",
  projectId: "project300-a824a",
  storageBucket: "project300-a824a.firebasestorage.app",
  messagingSenderId: "269458409878",
  appId: "1:269458409878:web:b63661e68e6f97079035b7",
  measurementId: "G-B39XZ5ZWYV"
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
};
