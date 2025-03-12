import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-meal',
  imports: [],
  templateUrl: './meal.component.html',
  styleUrl: './meal.component.css'
})
export class MealComponent implements OnInit {
@Input() url: string = '';
items: any[] = [];
show: boolean = false;

constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.url) {
      this.fetchMeals();
    }
  }

  ngOnChanges(): void {
    if (this.url) {
      this.fetchMeals();
    }
  }

  fetchMeals(): void {
    this.http.get<any>(this.url).subscribe((data) => {
      console.log(data.meals);
      this.items = data.meals;
      this.show = true;
    });
  }
}
