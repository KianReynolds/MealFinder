import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth'; 
@Component({
  selector: 'app-account-details',
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css'
})
export class AccountDetailsComponent {
  user$: Observable<User | null>; 
  
    constructor(private authService: AuthService) {
      this.user$ = this.authService.user$; 
    }
    
    logout() {
      this.authService.signOut();
    }
  }

