import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    imports: [FormsModule, CommonModule, RouterOutlet, RouterLink, RouterLinkActive]
})
export class SignupComponent {
  user = {
    fname: '',
    lname: '',
    email: '',
    password: '',
    allergies: {} as { [key: string]: boolean }
  };

  allergyOptions = ['Peanuts', 'Milk', 'Gluten', 'Shellfish'];

  constructor(private signupService: AuthService) {}

 
  get selectedAllergiesCount(): number {
    return Object.keys(this.user.allergies).filter(allergy => this.user.allergies[allergy]).length;
  }

  onSubmit() {
    // sign up w firebase
    this.signupService.firebaseSignUp(this.user.email, this.user.password)
      .then(user => {
        console.log('Firebase sign-up successful:', user);

        // after firebase is successfull call backend
        this.signupService.signup(this.user).subscribe(response => {
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


