import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AboutComponent } from './about/about.component';
import { LocationComponent } from './location/location.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path:'Home',component:AppComponent},
    {path:'sign-in',component:SignInComponent},
    {path:'about',component:AboutComponent},
    {path:'location',component:LocationComponent},
    //{path: '', redirectTo: '/location', pathMatch: 'full'},
    {path:'allergies',component:AllergiesComponent}
];
