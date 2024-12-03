import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { themealdbResponse } from './mealdbresponse';
import { themealdbApiService } from './services/themealdb-api.service';
import { Recipedbresponse } from './recipedbresponse';
import { SecondApiService } from './services/second-api.service';
import { RouterLinkActive } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Meal Finder';
  mealData: themealdbResponse | undefined;
  recipeData: Recipedbresponse | undefined;
  errorMessage: any;
  currentRoute: string = '';

  constructor(
    private _mealdbService: themealdbApiService,
    private _secondApiService: SecondApiService,
    private router: Router
  ) {}

  ngOnInit() {
    
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url; 
    });
  }

  
  shouldShowMealSearch(): boolean {
    return !this.currentRoute.includes('/signup');
  }

  getMealDetails(queryName: string): void {
    this._mealdbService.getMovieData(queryName).subscribe(
      result => {
        this.mealData = result;
        console.log(this.mealData?.meals);
      },
      error => this.errorMessage = <any>error
    );
  }
}

