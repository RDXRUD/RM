import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UsersService } from './home/users.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule, MAT_FORM_FIELD, MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule } from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatDialogModule} from '@angular/material/dialog';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { DialogComponent } from './dialog/dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';


// import {MatPaginatorModule} from '@angular/material/paginator';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    DialogComponent,
  ],
  imports: [
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
   MatTooltipModule
  ],
  providers: [UsersService,{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,useValue:{appearance:'fill'}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
