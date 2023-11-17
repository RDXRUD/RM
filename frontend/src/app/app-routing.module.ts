import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers/auth.guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RoleGuard } from './_helpers/auth.role';
import { AddProjectDialogComponent } from './_shared/add-project-dialog/add-project-dialog.component';
import { AddResourceProjectDialogComponent } from './_shared/add-resource-project-dialog/add-resource-project-dialog.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },

  { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'Admin', component: AdminComponent, canActivate: [AuthGuard, RoleGuard]
  },
  {
    path: 'UserProfile', component: UserProfileComponent, canActivate: [AuthGuard]
  },
  {
    path: 'Login', component: LoginComponent
  },
  { path: 'DetailReport', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'app-add-project-dialog', component: AddProjectDialogComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'app-add-resource-project-dialog', component: AddResourceProjectDialogComponent, canActivate: [AuthGuard, RoleGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }