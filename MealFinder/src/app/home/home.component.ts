import { Component } from '@angular/core';
import { themealdbApiService } from '../services/themealdb-api.service';
import { themealdbResponse, Meal } from '../../interfaces/mealdbresponse';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeIndexComponent } from '../recipe-index/recipe-index.component';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth'; 
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

  // Combine both dependencies into a single constructor
  constructor(
    private authService: AuthService,
    private _mealdbService: themealdbApiService
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
                ingredients, // Store extracted ingredients
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
}