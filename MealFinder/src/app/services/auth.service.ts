import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/signup';
  
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable(); 

  constructor(private http: HttpClient, private auth: Auth) {
    
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  //  Sign Up
  firebaseSignUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        this.userSubject.next(userCredential.user);
        return userCredential.user;
      })
      .catch((error: FirebaseError) => {
        console.error('Firebase sign-up error: ', error.message);
        throw new Error(error.message);
      });
  }

  signup(user: { fname: string; lname: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/signup`, user).pipe(
      catchError(err => {
        console.error('API sign-up error: ', err);
        return of(null); 
      })
    );
  }

  // Sign In
  firebaseSignIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        this.userSubject.next(userCredential.user);
        return userCredential.user;
      })
      .catch((error: FirebaseError) => {
        console.error('Firebase sign-in error: ', error.message);
        throw new Error(error.message);
      });
  }

  // Sign Out
  signOut() {
    return signOut(this.auth).then(() => {
      this.userSubject.next(null);
    });
  }

  
  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
