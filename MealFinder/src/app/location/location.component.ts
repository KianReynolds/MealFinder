import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
    selector: 'app-location',
    imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, GoogleMapsModule],
    templateUrl: './location.component.html',
    styleUrl: './location.component.css'
})
export class LocationComponent {

  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194};
  zoom = 12;

  options: google.maps.MapOptions = {
    maxZoom: 18,
    minZoom: 8,
  };
}
