import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, tap } from 'rxjs';
import { Meal, themealdbResponse } from '../../interfaces/mealdbresponse';


@Injectable({
  providedIn: 'root'
})
export class themealdbApiService {

private _siteURL = `http://localhost:3000/api/v1/meals/`;

private handleError(err:HttpErrorResponse){
  console.log('OmdbApiService:'+err.message);
  return throwError(() => new Error("OmdbApiService:" + err.message))
}
  constructor(private _http:HttpClient) { }

  getMealData(strMeal:string):Observable<themealdbResponse> {
    return this._http.get<themealdbResponse>(this._siteURL+ strMeal).pipe(
    catchError(this.handleError)
    );
  }

  
}

