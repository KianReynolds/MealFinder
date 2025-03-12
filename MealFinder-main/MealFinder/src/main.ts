import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));



































































//   const center = { lat: 50.064192, lng: -130.605469 };
//   // Create a bounding box with sides ~10km away from the center point
//   const defaultBounds = {
//     north: center.lat + 0.1,
//     south: center.lat - 0.1,
//     east: center.lng + 0.1,
//     west: center.lng - 0.1,
//   };
//   const input = document.getElementById("pac-input") as HTMLInputElement;
//   const options = {
//     bounds: defaultBounds,
//     componentRestrictions: { country: "us" },
//     fields: ["address_components", "geometry", "icon", "name"],
//     strictBounds: false,
//   };
  
//   const autocomplete = new google.maps.places.Autocomplete(input, options);

// Initialize and add the map
// let map;
// async function initMap(): Promise<void> {
//   // The location of Uluru
//   const position = { lat: -25.344, lng: 131.031 };

//   // Request needed libraries.
//   //@ts-ignore
//   const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
//   const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

//   // The map, centered at Uluru
//   map = new Map(
//     document.getElementById('map') as HTMLElement,
//     {
//       zoom: 4,
//       center: position,
//       mapId: 'DEMO_MAP_ID',
//     }
//   );

//   // The marker, positioned at Uluru
//   const marker = new AdvancedMarkerElement({
//     map: map,
//     position: position,
//     title: 'Uluru'
//   });
// }

// initMap();

// let map: google.maps.Map;
// let marker: google.maps.marker.AdvancedMarkerElement;
// let infoWindow: google.maps.InfoWindow;
// async function initMap(): Promise<void> {
//     // Request needed libraries.
//     //@ts-ignore
//     const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
//         google.maps.importLibrary("marker"),
//         google.maps.importLibrary("places")
//       ]);

//     // Initialize the map.
//     map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
//         center: { lat: 40.749933, lng: -73.98633 },
//         zoom: 13,
//         mapId: '4504f8b37365c3d0',
//         mapTypeControl: false,
//     });
//     //@ts-ignore
//     const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement();
//     //@ts-ignore
//     placeAutocomplete.id = 'place-autocomplete-input';

//     const card = document.getElementById('place-autocomplete-card') as HTMLElement;
//     //@ts-ignore
//     card.appendChild(placeAutocomplete);
//     map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

//     // Create the marker and infowindow
//     marker = new google.maps.marker.AdvancedMarkerElement({
//         map,
//     });

//     infoWindow = new google.maps.InfoWindow({});

//     // Add the gmp-placeselect listener, and display the results on the map.
//     //@ts-ignore
//     placeAutocomplete.addEventListener('gmp-placeselect', async ({ place }) => {
//         await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });

//         // If the place has a geometry, then present it on a map.
//         if (place.viewport) {
//             map.fitBounds(place.viewport);
//         } else {
//             map.setCenter(place.location);
//             map.setZoom(17);
//         }

//         let content = '<div id="infowindow-content">' +
//         '<span id="place-displayname" class="title">' + place.displayName + '</span><br />' +
//         '<span id="place-address">' + place.formattedAddress + '</span>' +
//         '</div>';

//         //updateInfoWindow(content, place.location);
//         marker.position = place.location;
//     });
//}

// Helper function to create an info window.
// function updateInfoWindow(content, center) {
//     infoWindow.setContent(content);
//     infoWindow.setPosition(center);
//     infoWindow.open({
//         map,
//         anchor: marker,
//         shouldFocus: false,
//     });
// }

//initMap();