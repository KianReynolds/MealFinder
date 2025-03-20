import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  user$: Observable<User | null>;
  userData: any;

  constructor(private authService: AuthService, private http: HttpClient) {
    this.user$ = this.authService.user$;
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  ngOnInit(): void {
    // Fetch user data after the user is authenticated
    this.user$.subscribe(user => {
      if (user) {
        this.fetchUserData(user.uid); // Fetch data from backend using the user UID
      }
    });
  }

  fetchUserData(firebaseId: string): void {
    // Make the GET request to fetch the user data
    this.http.get(`${environment.apiUrl}/users/${firebaseId}`).subscribe(
      (data: any) => {
        this.userData = data;  // Store the user data, including allergies
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  removeFromFavorites(favorite: any): void {
    this.user$.subscribe(user => {
      if (user) {
        const firebaseId = user.uid; // Use the authenticated user's UID
        const recipeId = favorite.idMeal; // Use idMeal to identify the recipe
  
        // Send a DELETE request to the backend to remove the favorite
        this.http.delete(`${environment.apiUrl}/meals/${firebaseId}/favorites/${recipeId}`)
          .subscribe(
            () => {
              // After successful removal, update the UI by filtering out the removed meal
              this.userData.favorites = this.userData.favorites.filter((fav: any) => fav.idMeal !== recipeId);
            },
            error => {
              console.error('Error removing recipe from favorites:', error);
            }
          );
      } else {
        alert('You must be logged in to remove meals from your favourites!');
      }
    });
  }

  logout() {
    this.authService.signOut();
  }
}
