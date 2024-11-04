import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { themealdbResponse } from '../mealdbresponse';
import { Recipedbresponse } from '../recipedbresponse';

@Injectable({
  providedIn: 'root'
})
export class themealdbApiService {
private _siteURL="https://www.themealdb.com/api/json/v1/1/search.php?s="

private _siteURL2="https://api.edamam.com/doc/open-api/recipe-search-v2.json"

private handleError(err:HttpErrorResponse){
  console.log('OmdbApiService:'+err.message);
  return throwError(() => new Error("OmdbApiService:" + err.message))
}
  constructor(private _http:HttpClient) { }

  getMovieData(strMeal:string):Observable<themealdbResponse> {
    return this._http.get<themealdbResponse>(this._siteURL + strMeal)
    .pipe(
      tap(data => console.log('Moviedata/error'+JSON.stringify(data))
    ),
    catchError(this.handleError)
    );
  }

  
}

// export class theRecipeApiService{
//   private _siteURL2="https://api.edamam.com/doc/open-api/recipe-search-v2.json"

//   private handleError(err:HttpErrorResponse){
//     console.log('OmdbApiService:'+err.message);
//     return throwError(() => new Error("OmdbApiService:" + err.message))
//   }
//     constructor(private _http:HttpClient) { }

//   getRecipeData2(strMeal:string):Observable<themealdbApiService> {
//     return this._http.get<themealdbResponse>(this._siteURL2 + strMeal)
//     .pipe(
//       tap(data => console.log('Moviedata/error'+JSON.stringify(data))
//     ),
//     catchError(this.handleError)
//     );
//   }
// }
