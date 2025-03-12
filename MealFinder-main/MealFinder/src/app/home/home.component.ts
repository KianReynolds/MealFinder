import { Component, OnInit } from '@angular/core';
import { themealdbApiService } from '../services/themealdb-api.service';
import { themealdbResponse, Meal } from '../../interfaces/mealdbresponse';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RecipeIndexComponent } from '../recipe-index/recipe-index.component';
import { CountryService } from '../country.service';


@Component({
    selector: 'app-home',
    imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule, RecipeIndexComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  title = 'Meal Finder';
  mealData: themealdbResponse | undefined;
  errorMessage: string | null = null;
  allergens = ['fish', 'peanut', 'milk']; // Hardcoded for now, replace with user data from DB
  mealUrl: string = 'https://www.themealdb.com/api/json/v1/1/search.php?f=a';
  constructor(private _mealdbService: themealdbApiService, private countryService: CountryService) {}

  ngOnInit(): void {}

  // Method to update the mealUrl when a letter is clicked
  setAlphaIndex(alpha: string): void {
    this.mealUrl = `https://www.themealdb.com/api/json/v1/1/search.php?f=${alpha}`;
  }

  getMealDetails(queryName: string): void {
    this._mealdbService.getMealData(queryName).subscribe(
      result => {
        if (result.meals) {
          this.mealData = {
            ...result,
            meals: result.meals.map(meal => {
              let ingredients: string[] = [];
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
