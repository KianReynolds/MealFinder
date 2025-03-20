import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive]
})
export class AuthComponent {
  isLoginMode = true; // Toggle between signup and login forms

  user = {
    fname: '',
    lname: '',
    email: '',
    password: '',
    allergies: {} as { [key: string]: boolean },
    preferences: {} as { [key: string]: boolean }
  };

  allergyOptions = ['Peanuts', 'Milk', 'Gluten', 'Shellfish','Chicken'];
  preferenceOptions = ['Onions', 'Mushroom', 'Cheese', 'Garlic'];
  
  user$: Observable<User | null>; 

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  get selectedAllergiesCount(): number {
    return Object.keys(this.user.allergies).filter(allergy => this.user.allergies[allergy]).length;
  }

  get selectedPreferencesCount(): number {
    return Object.keys(this.user.preferences).filter(preference => this.user.preferences[preference]).length;
  }

  toggleMode(event: Event) {
    event.preventDefault(); 
    this.isLoginMode = !this.isLoginMode;
  }
  
  onSubmit() {
    if (this.isLoginMode) {
      // Login logic
      this.authService.firebaseSignIn(this.user.email, this.user.password)
        .then(user => {
          console.log('Login successful:', user);
          this.router.navigate(['/']); 
        })
        .catch(error => {
          console.error('Login failed:', error);
        });
    } else {
      // Signup logic
      this.authService.firebaseSignUp(
        this.user.fname,
        this.user.lname,
        this.user.email,
        this.user.password,
        this.user.allergies,
        this.user.preferences
      ).then(user => {
        console.log('Firebase sign-up successful:', user);
        this.router.navigate(['/']); // Redirect to home page after sign-up
      })
      .catch(error => {
        console.error('Firebase sign-up failed:', error);
      });
    }
  }

  logout() {
    this.authService.signOut();
  }
}
