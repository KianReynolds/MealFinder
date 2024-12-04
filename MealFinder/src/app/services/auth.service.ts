import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/signup';

  constructor(private http: HttpClient) {}

  signup(user: { fname: string; lname: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

}
