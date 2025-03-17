import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth'; 
@Component({
    selector: 'app-about',
    imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css'
})
export class AboutComponent {
    user$: Observable<User | null>; 
  
    constructor(private authService: AuthService) {
      this.user$ = this.authService.user$; 
    }
    
    logout() {
      this.authService.signOut();
    }
  }
