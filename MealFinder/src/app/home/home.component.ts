import { Component, OnInit } from '@angular/core';
import { themealdbApiService } from '../services/themealdb-api.service';
import { themealdbResponse, Meal } from '../../interfaces/mealdbresponse';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeIndexComponent } from '../recipe-index/recipe-index.component';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule, RecipeIndexComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Meal Finder';
  mealData: themealdbResponse | undefined;
  errorMessage: string | null = null;
  allergens: string[] = []; // Allergens to be fetched from user data
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private _mealdbService: themealdbApiService,
    private http: HttpClient
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    // Fetch user allergies when the component is initialized
    this.user$.subscribe(user => {
      if (user) {
        this.fetchUserAllergies(user.uid);
      }
    });
  }

  logout() {
    this.authService.signOut();
  }

  fetchUserAllergies(firebaseId: string): void {
    this.http.get(`${environment.apiUrl}/users/${firebaseId}`).subscribe(
      (data: any) => {
        if (data?.allergies) {
          // Convert all allergens to lowercase
          this.allergens = Object.keys(data.allergies)
            .filter(allergy => data.allergies[allergy])
            .map(allergy => allergy.toLowerCase());
          console.log('User Allergies:', this.allergens); 
        }
      },
      error => {
        console.error('Error fetching user allergies:', error);
      }
    );
  }
  

  getMealDetails(queryName: string): void {
    const ingredients = queryName
      .split(',')
      .map(ingredient => ingredient.trim().toLowerCase())
      .filter(ingredient => ingredient !== "");

    if (ingredients.length === 0) {
      this.errorMessage = "Please enter at least one ingredient.";
      return;
    }

    this._mealdbService.getMealData(ingredients).subscribe(
      result => {
        if (result.meals) {
          this.mealData = {
            ...result,
            meals: result.meals.map(meal => {
              let mealIngredients: string[] = [];
              // Extract up to 20 ingredients from the meal object
              for (let i = 1; i <= 20; i++) {
                let ingredient = meal[`strIngredient${i}` as keyof Meal];
                if (typeof ingredient === "string" && ingredient.trim() !== "") {
                  mealIngredients.push(ingredient.toLowerCase());
                }
              }

              // Filter ingredients based on user allergies
              const allergensInMeal = mealIngredients.filter(ingredient => this.allergens.includes(ingredient));
              return {
                ...meal,
                ingredients: mealIngredients,
                allergens: allergensInMeal,
                containsAllergen: allergensInMeal.length > 0 // Set flag if allergens are found
              };
            })
          };
        }
      },
      error => {
        this.errorMessage = "Failed to fetch meal data. Please try again.";
      }
    );
  }

  addToFavourites(meal: any): void {
    this.user$.subscribe(user => {
      if (user) {
        this.addMealToFavorites(user.uid, meal);
      } else {
        alert('You must be logged in to add meals to your favourites!');
      }
    });
  }

  addMealToFavorites(firebaseId: string, meal: any): void {
    const favoriteMeal = {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
      strInstructions: meal.strInstructions,
      strIngredients: meal.strIngredients,
      strSource: meal.strSource,
      strYoutube: meal.strYoutube
    };

    this.http.post(`${environment.apiUrl}/meals/${firebaseId}/favorites`, favoriteMeal)
      .subscribe(
        response => {
          console.log('Meal added to favourites successfully!', response);
        },
        error => {
          console.error('Error adding meal to favourites', error);
        }
      );
  }
}
