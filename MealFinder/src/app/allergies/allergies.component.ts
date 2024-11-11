import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms'

@Component({
  selector: 'app-allergies',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule],
  templateUrl: './allergies.component.html',
  styleUrl: './allergies.component.css'
})
export class AllergiesComponent {
  allergyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.allergyForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required, Validators.minLength(6)], 
      allergies: this.fb.array([])
    });
  }

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
