import { Component } from '@angular/core';
import { themealdbApiService } from '../services/themealdb-api.service';
import { themealdbResponse } from '../../interfaces/mealdbresponse';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Meal } from '../../interfaces/mealdbresponse';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Meal Finder';
  mealData: themealdbResponse | undefined;
  errorMessage: any;
  allergens = ['fish', 'peanut', 'milk']; // List of hardcoded allergies for the video, we have to change this after inteirm so we take from users allergy in the db
  warningMessage: string | null = null;

  constructor(
    private _mealdbService: themealdbApiService,
  ) {}

  getMealDetails(queryName: string): void {
    this._mealdbService.getMealData(queryName).subscribe(
      result => {
        this.mealData = result;
        console.log(this.mealData?.meals);
        this.checkAllergens(this.mealData?.meals);
      },
      error => this.errorMessage = <any>error
    );
  }

  checkAllergens(meals: Meal[] | undefined) {
    if (!meals) return;
    
    
    this.warningMessage = null;

    // cycle meals ingredients for allergies
    meals.forEach(meal => {
      const ingredients = [
        meal.strIngredient1, meal.strIngredient2, meal.strIngredient3, 
        meal.strIngredient4, meal.strIngredient5, meal.strIngredient6, 
        meal.strIngredient7, meal.strIngredient8, meal.strIngredient9
      ];
      ingredients.forEach(ingredient => {
        if (ingredient && this.allergens.includes(ingredient.toLowerCase())) {
          this.warningMessage = `Warning: This recipe contains an allergen you are allergic to: ${ingredient}.`;
        }
      });
    });
  }
}

