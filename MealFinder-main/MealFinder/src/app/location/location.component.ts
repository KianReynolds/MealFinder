import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
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
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, GoogleMapsModule, ReactiveFormsModule],
  template: `
    <div class="location-container">
      <div class="search-container">
        <h2>Find Shops in County Sligo</h2>
        
        <!-- Place autocomplete search -->
        <div class="search-box">
          <label for="location-search">Search by location:</label>
          <input 
            id="location-search"
            #searchInput
            type="text" 
            placeholder="Enter a location in Sligo"
            class="search-input"
          >
        </div>
        
        <!-- Text search for shops -->
        <div class="search-box">
          <label for="shop-search">Search Sligo shops:</label>
          <input 
            id="shop-search"
            #textSearchInput
            type="text" 
            placeholder="Search for shops by name, type, or town"
            class="search-input"
          >
        </div>
      </div>

      <!-- Map container with inline dimensions -->
      <div id="map" #mapElement style="width: 100%; height: 400px; min-height: 400px; position: relative;"></div>

      <!-- Shops results list -->
      <div class="shops-list">
        <h3>Shops in Sligo ({{filteredShops.length}} results)</h3>
        <div *ngIf="filteredShops.length === 0" class="no-results">
          No shops found matching your search.
        </div>
        <ul>
          <li *ngFor="let shop of filteredShops" class="shop-item">
            <h4>{{shop.name}}</h4>
            <p>{{shop.category}} - {{shop.town}}</p>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrl: './location.component.css'
})
export class LocationComponent implements OnInit, AfterViewInit {
  @ViewChild('mapElement') mapElement!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('textSearchInput') textSearchInput!: ElementRef;

  map: any;
  autocomplete: any;
  markers: any[] = [];
  shops: Shop[] = [];
  filteredShops: Shop[] = [];
  mapInitialized = false;
  
  // County bounds for Sligo, Ireland
  sligoBounds = {
    north: 54.4702,
    south: 53.9124,
    east: -8.0840,
    west: -8.9511
  };

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load shops data early
    this.loadShops();
    console.log('Component initialized');
  }

  ngAfterViewInit(): void {
    console.log('After view init');
    console.log('Map element exists:', !!this.mapElement);
    
    // Use a longer timeout to ensure the DOM is fully rendered
    setTimeout(() => {
      this.initializeMapWithChecks();
    }, 500);
  }

  private initializeMapWithChecks(): void {
    console.log('Attempting to initialize map...');
    
    if (!this.mapElement) {
      console.error('Map element reference is still null');
      // Try again after another delay
      setTimeout(() => this.initializeMapWithChecks(), 500);
      return;
    }
    
    const mapDiv = document.getElementById('map');
    console.log('Map div by ID exists:', !!mapDiv);
    
    if (!mapDiv) {
      console.error('Map container not found by ID');
      // Try getting it by another method
      const allDivs = document.querySelectorAll('div');
      console.log('Total divs on page:', allDivs.length);
      
      // Force component to re-render
      this.cdr.detectChanges();
      
      // Try again after delay
      setTimeout(() => this.initializeMapWithChecks(), 500);
      return;
    }
    
    this.initMap();
  }

  private initMap(): void {
    try {
      console.log('Initializing map now');
      
      // Use the direct DOM element instead of the ViewChild reference
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        throw new Error('Map element still not found in DOM');
      }
      
      // Check dimensions
      console.log('Map element dimensions:', mapElement.offsetWidth, 'x', mapElement.offsetHeight);
      
      // Ensure map container has dimensions
      if (mapElement.offsetHeight === 0) {
        console.warn('Setting explicit height on map container');
        mapElement.style.height = '400px';
      }
      
      // Create the map instance
      this.map = new google.maps.Map(mapElement, {
        center: { lat: 54.2697, lng: -8.4694 }, // Sligo town center
        zoom: 10,
        restriction: {
          latLngBounds: this.sligoBounds,
          strictBounds: false
        }
      });

      console.log('Map object created');

      // Wait for the map to be fully loaded
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        console.log('Map fully loaded');
        this.mapInitialized = true;
        
        // Initialize autocomplete after map is ready
        setTimeout(() => {
          this.initAutocomplete();
          
          // Display initial shop markers
          this.searchSligoShops("");
          
          // Force Angular to update UI
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
      
      // Add text search functionality
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
    // Sample data
    this.shops = [
      { id: 1, name: "Joe's Cafe", county: "Sligo", town: "Strandhill", category: "Restaurant", location: { lat: 54.3052, lng: -8.5930 } },
      { id: 2, name: "Sligo Surf Shop", county: "Sligo", town: "Sligo Town", category: "Retail", location: { lat: 54.2731, lng: -8.4755 } },
      { id: 3, name: "Bean & Gone", county: "Mayo", town: "Ballina", category: "Cafe", location: { lat: 54.1155, lng: -9.1551 } },
      { id: 4, name: "Sligo Books", county: "Sligo", town: "Tubbercurry", category: "Retail", location: { lat: 54.0516, lng: -8.6869 } },
      { id: 5, name: "The Linen Shop", county: "Donegal", town: "Bundoran", category: "Retail", location: { lat: 54.4782, lng: -8.2816 } },
      { id: 6, name: "Sligo Bakery", county: "Sligo", town: "Sligo Town", category: "Food", location: { lat: 54.2697, lng: -8.4725 } },
      { id: 7, name: "Drumcliff Crafts", county: "Sligo", town: "Drumcliff", category: "Crafts", location: { lat: 54.3302, lng: -8.4958 } }
    ];
  }
  
  searchSligoShops(searchQuery: string): void {
    if (!this.mapInitialized) {
      console.warn('Map not yet initialized, delaying search');
      setTimeout(() => this.searchSligoShops(searchQuery), 500);
      return;
    }
    
    // Clear existing markers
    this.clearMarkers();
    
    // Convert search query to lowercase for case-insensitive matching
    const query = searchQuery.toLowerCase().trim();
    
    // First filter for County Sligo shops only
    const sligoShops = this.shops.filter(shop => 
      shop.county && shop.county.toLowerCase() === 'sligo'
    );
    
    // Then search within Sligo shops based on the query
    if (query === '') {
      // If no search term, return all Sligo shops
      this.filteredShops = sligoShops;
    } else {
      // Search within Sligo shops
      this.filteredShops = sligoShops.filter(shop => {
        return (
          (shop.name && shop.name.toLowerCase().includes(query)) ||
          (shop.category && shop.category.toLowerCase().includes(query)) ||
          (shop.town && shop.town.toLowerCase().includes(query)) ||
          (shop.description && shop.description.toLowerCase().includes(query))
        );
      });
    }
    
    // Add markers for filtered shops
    this.displayShopMarkers();
  }
  
  private displayShopMarkers(): void {
    if (!this.map || !this.mapInitialized) {
      console.warn('Map not ready for markers');
      return;
    }
    
    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();
    let hasValidMarkers = false;
    
    this.filteredShops.forEach(shop => {
      if (shop.location) {
        const marker = new google.maps.Marker({
          position: shop.location,
          map: this.map,
          title: shop.name
        });
        
        // Add info window
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
    
    // Adjust map to fit all markers if we have any
    if (hasValidMarkers) {
      try {
        this.map.fitBounds(bounds);
        
        // If only one result, zoom in more
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