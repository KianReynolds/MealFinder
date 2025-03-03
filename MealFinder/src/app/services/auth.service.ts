import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/signup';

  constructor(private http: HttpClient, private auth: Auth) {}

  // firebase sign up
  firebaseSignUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
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

  // firebase sign in
  firebaseSignIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        return userCredential.user;
      })
      .catch((error: FirebaseError) => {
        console.error('Firebase sign-in error: ', error.message);
        throw new Error(error.message);
      });
  }

  // Sign out
  signOut() {
    return signOut(this.auth);
  }
}
