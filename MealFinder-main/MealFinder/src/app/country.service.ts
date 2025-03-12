import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiLoaded = false;

  loadGoogleMaps(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.apiLoaded) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.apiLoaded = true;
        resolve();
      };
      script.onerror = () => reject('Google Maps failed to load.');
      
      document.head.appendChild(script);
    });
  }
}
