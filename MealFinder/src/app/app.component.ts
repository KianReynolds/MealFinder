import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CommonModule,
    AngularFireAuthModule, // Firebase Authentication
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   title = 'Meal Finder';
 
  // mealData:themealdbResponse | undefined;
  
  // errorMessage:any;

  // constructor(
  //   private _mealdbService:themealdbApiService,
    
  // ) {}

  
  // getMealDetails(queryName:string) : void {
  //   this._mealdbService.getMealData(queryName).subscribe(
  //     result => {
  //       this.mealData = result;
  //       console.log(this.mealData?.meals);
  //     },
  //     error => this.errorMessage = <any>error
  //   );
  // }

   
}


