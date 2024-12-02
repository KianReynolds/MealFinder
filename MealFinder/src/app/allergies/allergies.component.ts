import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms'
import { ApiService } from '../api.service';
import { OnInit } from '@angular/core';
import { response } from 'express';
import { error } from 'console';
import { Recipedbresponse } from '../recipedbresponse';


@Component({
  selector: 'app-allergies',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule],
  templateUrl: './allergies.component.html',
  styleUrl: './allergies.component.css'
})
export class AllergiesComponent implements OnInit {
  allergyForm: FormGroup;
  searchQuery: string = "";
  recipes: any[] = [];

  recipeData:Recipedbresponse | undefined;
  errorMessage:any;

  //allergies: Set<string> = new Set();
  //allergiesList: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.allergyForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.minLength(6)], 
      allergies: this.fb.array([])
    });
  }

  ngOnInit(): void {
    //this.fetchAllergies();
  }

  onSearch(searchQuery: string): void {
    this.apiService.searchRecipes(searchQuery).subscribe(
      result => {
        this.recipeData=result;
        console.log(this.recipeData.hits);

      },
      error => this.errorMessage = <any>error
    );
  }

  // fetchAllergies(): void {
  //   this.apiService.getAllergies().subscribe(
  //     (response) => {
  //       const recipes = response.hits;
  //       recipes.forEach((recipe: any) => {
  //         recipe.recipe.healthLabels.forEach((label: string) => {
  //           this.allergies.add(label);
  //         });
  //       });
  //     },
  //     (error) => {
  //       console.error("Error fetching allergies:", error)
  //     }
  //   );
  // }

  

  get allergies(): FormArray {
    return this.allergyForm.get('allergies') as FormArray;
  }

  addAllergy(): void {
    this.allergies.push(this.fb.control('', Validators.required));

  }

  removeAllergy(index: number): void {
    this.allergies.removeAt(index);
  }

  onSubmit(): void {
    if (this.allergyForm.valid) {
      console.log('Form Submitted', this.allergyForm.value);
    } else {
      console.log('Form is not valid');
    }
  }
}
