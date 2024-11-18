import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private baseUrl = "https://api.edamam.com/search?q=REQUIRED&app_id=2bee36e1&app_key=66640312dfa9edb8093c37a1c19f766f";

  constructor(private http: HttpClient) { }

  getItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }


}
