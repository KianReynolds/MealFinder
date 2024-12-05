import { Component } from '@angular/core';

@Component({
  selector: 'app-recipe-index',
  standalone: true,
  imports: [],
  templateUrl: './recipe-index.component.html',
  styleUrl: './recipe-index.component.css'
})
export class RecipeIndexComponent {
  alpha: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
}

