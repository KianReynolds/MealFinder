import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth'; 
import { ReactiveFormsModule } from '@angular/forms';
declare var google: any;


interface Shop {
  id: number;
  name: string;
  county: string;
  town: string;
  category: string;
  location?: google.maps.LatLngLiteral;
  description?: string;
}

@Component({
  selector: 'app-location',
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, GoogleMapsModule, ReactiveFormsModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']  
})
export class LocationComponent implements OnInit, AfterViewInit{
  user$: Observable<User | null>; 
  
    
    
    logout() {
      this.authService.signOut();
    }
  @ViewChild('mapElement') mapElement!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('textSearchInput') textSearchInput!: ElementRef;

  map: any;
  autocomplete: any;
  markers: any[] = [];
  shops: Shop[] = [];
  filteredShops: Shop[] = [];
  mapInitialized = false;
  
  // Restrictions to keep area in Sligo
  sligoBounds = {
    north: 54.4702,
    south: 53.9124,
    east: -8.0840,
    west: -8.9511
  };

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.user$ = this.authService.user$; 
  }

  ngOnInit(): void {
    
    this.loadShops();
    console.log('Component initialized');
  }

  ngAfterViewInit(): void {
    console.log('After view init');
    console.log('Map element exists:', !!this.mapElement);
    
    // Timeout for DOM to ready
    setTimeout(() => {
      this.initializeMapWithChecks();
    }, 500);
  }

  private initializeMapWithChecks(): void {
    console.log('Attempting to initialize map...');
    
    if (!this.mapElement) {
      console.error('Map element reference is still null');
  
      setTimeout(() => this.initializeMapWithChecks(), 500);
      return;
    }
    
    const mapDiv = document.getElementById('map');
    console.log('Map div by ID exists:', !!mapDiv);
    
    if (!mapDiv) {
      console.error('Map container not found by ID');
    
      const allDivs = document.querySelectorAll('div');
      console.log('Total divs on page:', allDivs.length);
      
      
      this.cdr.detectChanges();
      
      
      setTimeout(() => this.initializeMapWithChecks(), 500);
      return;
    }
    
    this.initMap();
  }

  private initMap(): void {
    try {
      console.log('Initializing map now');
      
    
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        throw new Error('Map element still not found in DOM');
      }
      
      
      console.log('Map element dimensions:', mapElement.offsetWidth, 'x', mapElement.offsetHeight);
    
      if (mapElement.offsetHeight === 0) {
        console.warn('Setting explicit height on map container');
        mapElement.style.height = '400px';
      }
      
      // Create map
      this.map = new google.maps.Map(mapElement, {
        center: { lat: 54.2697, lng: -8.4694 }, 
        zoom: 10,
        restriction: {
          latLngBounds: this.sligoBounds,
          strictBounds: false
        }
      });

      console.log('Map object created');

      
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        console.log('Map fully loaded');
        this.mapInitialized = true;
        
        // Start autocomplete 
        setTimeout(() => {
          this.initAutocomplete();
          
          // Display shop markers
          this.searchSligoShops("");
          
          
          this.cdr.detectChanges();
        }, 100);
      });
    } catch (e) {
      console.error('Error initializing map:', e);
    }
  }

  private initAutocomplete(): void {
    if (!this.searchInput) {
      console.error('Search input element not found');
      return;
    }

    try {
      const options: any = {
        bounds: new google.maps.LatLngBounds(
          { lat: this.sligoBounds.south, lng: this.sligoBounds.west },
          { lat: this.sligoBounds.north, lng: this.sligoBounds.east }
        ),
        componentRestrictions: { country: 'ie' },
        fields: ['geometry', 'name', 'formatted_address'],
      };
      
      this.autocomplete = new google.maps.places.Autocomplete(
        this.searchInput.nativeElement, 
        options
      );
      
      this.autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = this.autocomplete.getPlace();
          if (place.geometry) {
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(15);

            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map: this.map,
              title: place.name
            });
            
            this.markers.push(marker);
          }
        });
      });
      
      
      if (this.textSearchInput) {
        this.textSearchInput.nativeElement.addEventListener('input', (e: any) => {
          this.ngZone.run(() => {
            this.searchSligoShops(e.target.value);
          });
        });
      }
    } catch (e) {
      console.error('Error initializing autocomplete:', e);
    }
  }
  
  private loadShops(): void {
    this.shops = [
      // { id: 1, name: "Tír na nÓg Organics", county: "Sligo", town: "Sligo Town", category: "Organic Store", location: { lat: 54.2730, lng: -8.4767 } },
      //   { id: 2, name: "Cosgrove & Son Delicatessen", county: "Sligo", town: "Sligo Town", category: "Delicatessen", location: { lat: 54.2738, lng: -8.4767 } },
      //   { id: 3, name: "Lyons Cafe & Bakeshop", county: "Sligo", town: "Sligo Town", category: "Bakery", location: { lat: 54.2731, lng: -8.4775 } },
      //   { id: 4, name: "Lauren's Patisserie", county: "Sligo", town: "Sligo Town", category: "Patisserie", location: { lat: 54.2735, lng: -8.4745 }},
      //   { id: 5, name: "The Wellness Shop", county: "Sligo", town: "Sligo Town", category: "Health Food Store", location: { lat: 54.2725, lng: -8.4770 } }
        { id: 1, name: "Sligo Organic Vegetables", county: "Sligo", town: "Sligo Town", category: "Groceries", location: { lat: 54.2697, lng: -8.4694 } },
        { id: 2, name: "The Health Hub", county: "Sligo", town: "Sligo Town", category: "Health Food", location: { lat: 54.2731, lng: -8.4755 } },
        { id: 3, name: "Strandhill Market", county: "Sligo", town: "Strandhill", category: "Farmers Market", location: { lat: 54.2706, lng: -8.4716 } },
        { id: 4, name: "Tubbercurry Fresh Produce", county: "Sligo", town: "Tubbercurry", category: "Groceries", location: { lat: 54.0516, lng: -8.6869 } },
        { id: 5, name: "Drumcliff Farm Foods", county: "Sligo", town: "Drumcliff", category: "Farm Shop", location: { lat: 54.3302, lng: -8.4958 } }

    ];
  }
  
  searchSligoShops(searchQuery: string): void {
    if (!this.mapInitialized) {
      console.warn('Map not yet initialized, delaying search');
      setTimeout(() => this.searchSligoShops(searchQuery), 500);
      return;
    }
    
    
    this.clearMarkers();
    
    
    const query = searchQuery.toLowerCase().trim();
  
    
    const sligoShops = this.shops.filter(shop => 
      shop.county && shop.county.toLowerCase() === 'sligo'
    );
    
  
    if (query === '') {
    
      this.filteredShops = sligoShops;
    } else {
      // Search Sligo shops
      this.filteredShops = sligoShops.filter(shop => {
        return (
          (shop.name && shop.name.toLowerCase().includes(query)) ||
          (shop.category && shop.category.toLowerCase().includes(query)) ||
          (shop.town && shop.town.toLowerCase().includes(query)) ||
          (shop.description && shop.description.toLowerCase().includes(query))
        );
      });
    }
    
    
    this.displayShopMarkers();
  }
  
  private displayShopMarkers(): void {
    if (!this.map || !this.mapInitialized) {
      console.warn('Map not ready for markers');
      return;
    }
    
    
    const bounds = new google.maps.LatLngBounds();
    let hasValidMarkers = false;
    
    this.filteredShops.forEach(shop => {
      if (shop.location) {
        const marker = new google.maps.Marker({
          position: shop.location,
          map: this.map,
          title: shop.name
        });
        
        // The information section
        const infoWindow = new google.maps.InfoWindow({
          content: `<div>
            <h3>${shop.name}</h3>
            <p>${shop.category} in ${shop.town}, County ${shop.county}</p>
          </div>`
        });
        
        marker.addListener('click', () => {
          infoWindow.open(this.map, marker);
        });
        
        this.markers.push(marker);
        bounds.extend(shop.location);
        hasValidMarkers = true;
      }
    });
    
    
    if (hasValidMarkers) {
      try {
        this.map.fitBounds(bounds);
        
      
        if (this.filteredShops.length === 1) {
          this.map.setZoom(15);
        }
      } catch (e) {
        console.error('Error fitting bounds:', e);
      }
    }
  }
  
  private clearMarkers(): void {
    this.markers.forEach(marker => {
      if (marker) {
        marker.setMap(null);
      }
    });
    this.markers = [];
  }
}

