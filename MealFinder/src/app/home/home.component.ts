import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { themealdbApiService } from '../services/themealdb-api.service';
import { themealdbResponse } from '../../interfaces/mealdbresponse';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import  HelloReact from '../components/RecipeIndex';
import { renderReactComponent } from '../components/react-wrapper';
import RecipeIndex from '../components/RecipeIndex';
import { RecipeIndexComponent } from '../recipe-index/recipe-index.component';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule, RecipeIndexComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit{
  title = 'Meal Finder';
 
  mealData:themealdbResponse | undefined;
  
  errorMessage:any;

  constructor(
    private _mealdbService:themealdbApiService,
    private elRef: ElementRef,
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

  ngAfterViewInit() {
    const container = this.elRef.nativeElement.querySelector('#react-root');
    renderReactComponent(RecipeIndex, container);
  }

  
}
