import { Component } from '@angular/core';
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
export class HomeComponent {
  title = 'Meal Finder';
  mealData: themealdbResponse | undefined;
  errorMessage: string | null = null;
  allergens = ['fish', 'peanut', 'milk']; // Hardcoded for now, replace with user data from DB
  
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private _mealdbService: themealdbApiService,
    private http: HttpClient
  ) {
    this.user$ = this.authService.user$;
  }

  logout() {
    this.authService.signOut();
  }

  getMealDetails(queryName: string): void {
    this._mealdbService.getMealData(queryName).subscribe(
      result => {
        if (result.meals) {
          this.mealData = {
            ...result,
            meals: result.meals.map(meal => {
              let ingredients: string[] = [];
              // Extract up to 20 ingredients from the meal object
              for (let i = 1; i <= 20; i++) {
                let ingredient = meal[`strIngredient${i}` as keyof Meal];
                if (typeof ingredient === "string" && ingredient.trim() !== "") {
                  ingredients.push(ingredient.toLowerCase());
                }
              }

              return {
                ...meal,
                ingredients, 
                allergens: ingredients.filter(ingredient => this.allergens.includes(ingredient)),
                containsAllergen: ingredients.some(ingredient => this.allergens.includes(ingredient))
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
