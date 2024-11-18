import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private baseUrl = "https://api.edamam.com/search?q=REQUIRED&app_id=2bee36e1&app_key=66640312dfa9edb8093c37a1c19f766f";


  private handleError(err:HttpErrorResponse){
    console.log('OmdbApiService:'+err.message);
    return throwError(() => new Error("OmdbApiService:" + err.message))
  }

  constructor(private http: HttpClient) { }

  searchRecipes(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}?q=${query}`);
  } 
}