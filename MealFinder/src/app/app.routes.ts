import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { LocationComponent } from './location/location.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
export const routes: Routes = [
    {path:'Home',component:AppComponent},
    {path:'about',component:AboutComponent},
    {path:'location',component:LocationComponent},
    {path: 'signup', component:SignupComponent},
    {path:'allergies',component:AllergiesComponent}
];
