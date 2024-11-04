import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { themealdbResponse } from './mealdbresponse';
import { themealdbApiService } from './services/themealdb-api.service';
import { CommonModule } from '@angular/common';
import { Recipedbresponse } from './recipedbresponse';
import { SecondApiService } from './services/second-api.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'})

export class AppComponent {
  title = 'Meal Finder';
  mealData:themealdbResponse | undefined;
  recipeData:Recipedbresponse | undefined;
  errorMessage:any;

  constructor(
    private _mealdbService:themealdbApiService,
    private _secondApiService: SecondApiService
  ) {}

  
  getMealDetails(queryName:string) : void {
    this._mealdbService.getMovieData(queryName).subscribe(
      result => {
        this.mealData=result;
        console.log(this.mealData.meals);

      },
      error => this.errorMessage = <any>error
    );

  }

  // getRecipeDetails(queryName:string) : void {
  //   this._mealdbService.getMovieData(queryName).subscribe(
  //     (result) => {
  //       this.recipeData=result;
  //       console.log("Second API Data:", this.recipeData?.recipe);

  //     },
  //     error => this.errorMessage = <any>error
  //   );

  //}
   
}
