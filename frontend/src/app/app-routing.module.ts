import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/AuthGuard';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },

  { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'Admin', component: AdminComponent, canActivate: [AuthGuard]
  },
  {
    path: 'Login', component: LoginComponent
  },
  { path: 'Logout', component: LogoutComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }