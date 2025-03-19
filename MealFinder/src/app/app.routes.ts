import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { LocationComponent } from './location/location.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { AccountDetailsComponent } from './account-details/account-details.component';


export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path: 'home', redirectTo: '/'},
    {path:'about',component:AboutComponent},
    {path:'location',component:LocationComponent},
    {path: 'auth', component:AuthComponent},
    {path: 'accountdetails', component:AccountDetailsComponent}
];
