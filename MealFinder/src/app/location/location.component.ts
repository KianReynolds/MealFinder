import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth'; 

@Component({
  selector: 'app-location',
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, GoogleMapsModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']  
})
export class LocationComponent {
  user$: Observable<User | null>; 

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.signOut();
  }
  
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };
  zoom = 12;

  options: google.maps.MapOptions = {
    maxZoom: 18,
    minZoom: 8,
  };
}

