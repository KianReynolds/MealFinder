import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { themealdbResponse } from './mealdbresponse';
import { themealdbApiService } from './services/themealdb-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'})

export class AppComponent {
  title = 'Meal Finder';
  mealData:themealdbResponse | undefined;
  errorMessage:any;

  constructor(private _mealdbService:themealdbApiService) {
  }

  getMealDetails(queryName:string) : void {
    this._mealdbService.getMovieData(queryName).subscribe(
      result => {
        this.mealData=result;
        console.log(this.mealData.meals);

      },
      error => this.errorMessage = <any>error
    );

  }
   
}
