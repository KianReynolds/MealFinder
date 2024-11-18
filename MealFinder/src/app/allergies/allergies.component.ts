import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms'
import { ApiService } from '../api.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-allergies',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule],
  templateUrl: './allergies.component.html',
  styleUrl: './allergies.component.css'
})
export class AllergiesComponent implements OnInit {
  //allergyForm: FormGroup;
  searchQuery: string = "";
  recipes: any[] = [];

  constructor(
    //private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {}

  searchRecipes(): void {
    this.apiService.searchRecipes(this.searchQuery).subscribe({
      next: (data) => {
        this.recipes = data.results;
        console.log("Recipes:", this.recipes);
      },
      error: (err) => {
        console.error("Error fetching recipes:",err);
      },
    });
  }












    // this.allergyForm = this.fb.group({
    //   username: ['', Validators.required],
    //   email: ['', Validators.required, Validators.email],
    //   password: ['', Validators.required, Validators.minLength(6)], 
    //   allergies: this.fb.array([])
    // });
  

  // get allergies(): FormArray {
  //   return this.allergyForm.get('allergies') as FormArray;
  // }

  // addAllergy(): void {
  //   this.allergies.push(this.fb.control('', Validators.required));

  // }

  // removeAllergy(index: number): void {
  //   this.allergies.removeAt(index);
  // }

  // onSubmit(): void {
  //   if (this.allergyForm.valid) {
  //     console.log('Form Submitted', this.allergyForm.value);
  //   } else {
  //     console.log('Form is not valid');
  //   }
  // }
}
