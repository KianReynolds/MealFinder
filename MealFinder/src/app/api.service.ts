import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Recipedbresponse } from './recipedbresponse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private baseUrl = "https://api.edamam.com/api/recipes/v2";
  private API_ID = "2bee36e1";
  private APP_KEY = "66640312dfa9edb8093c37a1c19f766f";

  private handleError(err:HttpErrorResponse){
    console.log('ApiService:'+err.message);
    return throwError(() => new Error("ApiService:" + err.message))
  }

  constructor(private http: HttpClient) { }


  searchRecipes(strMeal:string):Observable<Recipedbresponse> {
    return this.http.get<Recipedbresponse>(this.baseUrl + strMeal)
    .pipe(
      tap(data => console.log('Moviedata/error'+JSON.stringify(data))
    ),
    catchError(this.handleError)
    );
  }


  // searchRecipes(query: string): Observable<any> {
  //   const params = new HttpParams()
  //   .set('q', query)
  //   .set('app_id', this.API_ID)
  //   .set('app_key', this.APP_KEY)
  //   .set('type', 'public')

  //   return this.http.get<any>(`${this.baseUrl}, {param}`);
  // } 

  // getAllergies(): Observable<any> {
  //   const params = new HttpParams()
  //     .set("type", "public")
  //     .set("q", "*")
  //     .set("app_id", this.API_ID)
  //     .set("app_key", this.APP_KEY)
  //     .set("field", "healthLabels");

  //   return this.http.get(this.baseUrl, {params}).pipe(
  //     catchError(this.handleError)
  //   );
  // }
}