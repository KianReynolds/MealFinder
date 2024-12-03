import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Meal, themealdbResponse } from './mealdbresponse';
import { themealdbApiService } from './services/themealdb-api.service';
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
 
  mealData:themealdbResponse | undefined;
  
  errorMessage:any;

  constructor(
    private _mealdbService:themealdbApiService,
    
  ) {}

  ngOnInit() {
    
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url; 
    });
  }

  
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

