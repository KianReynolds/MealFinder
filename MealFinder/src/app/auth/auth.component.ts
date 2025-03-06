import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive]
})
export class AuthComponent {
  isLoginMode = true; // Toggle between login and signup

  user = {
    fname: '',
    lname: '',
    email: '',
    password: '',
    allergies: {} as { [key: string]: boolean }
  };

  allergyOptions = ['Peanuts', 'Milk', 'Gluten', 'Shellfish'];

  constructor(private authService: AuthService) {}

  get selectedAllergiesCount(): number {
    return Object.keys(this.user.allergies).filter(allergy => this.user.allergies[allergy]).length;
  }

  toggleMode(event: Event) {
    event.preventDefault(); // Prevents the page from refreshing
    this.isLoginMode = !this.isLoginMode;
  }
  
  onSubmit() {
    if (this.isLoginMode) {
      // Login logic
      this.authService.firebaseSignIn(this.user.email, this.user.password)
        .then(user => {
          console.log('Login successful:', user);
        })
        .catch(error => {
          console.error('Login failed:', error);
        });
    } else {
      // Signup logic
      this.authService.firebaseSignUp(this.user.email, this.user.password)
        .then(user => {
          console.log('Firebase sign-up successful:', user);
          this.authService.signup(this.user).subscribe(response => {
            console.log('API sign-up successful!', response);
          }, error => {
            console.error('API sign-up failed!', error);
          });
        })
        .catch(error => {
          console.error('Firebase sign-up failed!', error);
        });
    }
  }
}
