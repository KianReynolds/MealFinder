import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/signup`;  // Use production API URL

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable(); 

  constructor(private http: HttpClient, private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  // firebase signing up and sending data to mongo
  firebaseSignUp(fname: string, lname: string, email: string, password: string, allergies: { [key: string]: boolean; }, preferences: { [key: string]: boolean; }) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const firebaseUser = userCredential.user;
        this.userSubject.next(firebaseUser);

        const userData = {
          firebaseId: firebaseUser.uid,
          fname,
          lname,
          allergies,
          favorites: [] 
        };

        // Send user data to MongoDB
        return this.http.post(`${this.apiUrl}`, userData).toPromise();
      })
      .catch((error: FirebaseError) => {
        console.error('Firebase sign-up error: ', error.message);
        throw new Error(error.message);
      });
  }

  // Firebase Login
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

  // Logout
  signOut() {
    return signOut(this.auth).then(() => {
      this.userSubject.next(null);
    });
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}