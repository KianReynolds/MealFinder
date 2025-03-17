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
        this.userData = data;  // Store the user data
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  removeFromFavorites(favorite: any): void {
    const firebaseId = this.userData?.firebaseId; // Make sure this is how you access the user's ID
    const recipeId = favorite.idMeal; // Assuming you use idMeal to identify the recipe

    // Send the request to the backend to remove the recipe from favorites
    this.http.delete(`${environment.apiUrl}/meals/${firebaseId}/favorites/${recipeId}`).subscribe(
      () => {
        // After success, filter out the removed favorite from the list
        this.userData.favorites = this.userData.favorites.filter((fav: any) => fav.idMeal !== recipeId);
      },
      error => {
        console.error('Error removing recipe from favorites:', error);
      }
    );
  }
  logout() {
    this.authService.signOut();
  }
}
