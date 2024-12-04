import { Component } from '@angular/core';
import { themealdbApiService } from '../services/themealdb-api.service';
import { themealdbResponse } from '../../interfaces/mealdbresponse';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'Meal Finder';
 
  mealData:themealdbResponse | undefined;
  
  errorMessage:any;

  constructor(
    private _mealdbService:themealdbApiService,
    
  ) {}

  
  getMealDetails(queryName:string) : void {
    this._mealdbService.getMealData(queryName).subscribe(
      result => {
        this.mealData = result;
        console.log(this.mealData?.meals);
      },
      error => this.errorMessage = <any>error
    );
  }
}
