import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-recipe-index',
    imports: [CommonModule],
    templateUrl: './recipe-index.component.html',
    styleUrl: './recipe-index.component.css'
})
export class RecipeIndexComponent {
  alpha: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  @Output() alphaIndex = new EventEmitter<string>();

  handleClick(letter: string): void {
    this.alphaIndex.emit(letter);
  }
}

