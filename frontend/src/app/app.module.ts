import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { EditResSkillDialogComponent } from './_shared/edit-res-skill-dialog/edit-res-skill-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { LoginComponent } from './login/login.component';
import { EditEmpSkillDialogComponent } from './_shared/edit-emp-skill-dialog/edit-emp-skill-dialog.component';
import { EditSkillDialogComponent } from './_shared/edit-skill-dialog/edit-skill-dialog.component';
import { RouterModule } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditResDailogComponent } from './_shared/edit-res-dailog/edit-res-dailog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ResetPasswordDailogComponent } from './_shared/reset-password-dailog/reset-password-dailog.component';
import { UpdateProfileDialogComponent } from './_shared/update-profile-dialog/update-profile-dialog.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { EditClientDialogComponent } from './_shared/edit-client-dialog/edit-client-dialog.component';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddProjectDialogComponent } from './_shared/add-project-dialog/add-project-dialog.component';
import { AddResourceProjectDialogComponent } from './_shared/add-resource-project-dialog/add-resource-project-dialog.component';
import { EditProjectDialogComponent } from './_shared/edit-project-dialog/edit-project-dialog.component';
import { EditProjectResourceDialogComponent } from './_shared/edit-project-resource-dialog/edit-project-resource-dialog.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EditSkillGroupDialogComponent } from './_shared/edit-skill-group-dialog/edit-skill-group-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AllocateResourceByNameDialogComponent } from './_shared/allocate-resource-by-name-dialog/allocate-resource-by-name-dialog.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AllocateResourceDialogComponent } from './_shared/allocate-resource-dialog/allocate-resource-dialog.component';
import { SpinnerComponent } from './spinner/spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { InterceptorService } from './_interceptors/http-request-interceptor';

@NgModule({
  declarations: [
    // { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_TIME_FORMAT},
    AppComponent,
    HomeComponent,
    AdminComponent,
    EditResSkillDialogComponent,
    LoginComponent,
    EditEmpSkillDialogComponent,
    EditSkillDialogComponent,
    EditResDailogComponent,
    UserProfileComponent,
    ResetPasswordDailogComponent,
    UpdateProfileDialogComponent,
    EditClientDialogComponent,
    AddProjectDialogComponent,
    AddResourceProjectDialogComponent,
    EditProjectDialogComponent,
    EditProjectResourceDialogComponent,
    EditSkillGroupDialogComponent,
    AllocateResourceByNameDialogComponent,
    AllocateResourceDialogComponent,
    SpinnerComponent
  ],
  imports: [
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSortModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTabsModule,
    FlexLayoutModule,
    MatDialogModule,
    NgxMatFileInputModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatTableModule,
    MatPaginatorModule,
    NgFor, MatButtonModule, NgIf, MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    DragDropModule,
    OAuthModule.forRoot({
      resourceServer: {
          allowedUrls: ['http://www.angular.at/api'],
          sendAccessToken: true
      }
  }),

    RouterModule.forRoot(routes),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token');
        }

      },
    }),
  ],
  providers: [
  { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }