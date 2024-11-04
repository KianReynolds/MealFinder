import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { Recipedbresponse } from '../recipedbresponse';




@Injectable({
  providedIn: 'root'
})
export class SecondApiService {

  private _siteURL2="https://api.edamam.com/doc/open-api/recipe-search-v2.json"

  private handleError(err:HttpErrorResponse){
    console.log('RecipeApiService:'+err.message);
    return throwError(() => new Error("RecipeApiService:" + err.message))
  }

  constructor(private _http:HttpClient) { }

  getRecipeData(strMeal:string):Observable<Recipedbresponse> {
    return this._http.get<Recipedbresponse>(this._siteURL2 + strMeal)
    .pipe(
      tap(data => console.log('Recipedata/error' + JSON.stringify(data))
    ),
    catchError(this.handleError)
    );
  }

}
