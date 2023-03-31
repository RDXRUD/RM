import { Component,NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
// import { AuthGuard } from './login/AuthGuard';

const routes: Routes = [
   { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path:'Home',component: HomeComponent},
  {
    path:'Admin',component:AdminComponent
  },
  {path:'Login',component:LoginComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// canActivate: [AuthGuard]