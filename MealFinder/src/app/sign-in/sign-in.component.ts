import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterLink,RouterLinkActive, FormsModule, ReactiveFormsModule, MatToolbarModule,MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {

  SignInForm : FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl ('', [Validators.required, Validators.minLength(3)]),
  })

  get email() {
    return this.SignInForm.get('email');
  }

  get password() {
    return this.SignInForm.get('password');
  }


  

  onSubmit(){
    console.log('forms submitted with ');
    console.table(this.SignInForm.value);
  }



}
