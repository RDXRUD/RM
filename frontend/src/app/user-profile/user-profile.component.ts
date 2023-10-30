import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ResetPasswordDailogComponent } from '../_shared/reset-password-dailog/reset-password-dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileDialogComponent } from '../_shared/update-profile-dialog/update-profile-dialog.component';
import { ResourcesService } from '../_services/resources.service';
import { resource } from '../_model/resource';
interface Location {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userID: any;
  userData!: resource[];
  resourceProfile!: FormGroup;
  locations: Location[] = [
    { value: 'IN', viewValue: 'IN' },
    { value: 'US', viewValue: 'US' },
    { value: 'EU', viewValue: 'EU' },
    { value: 'JP', viewValue: 'JP' },
    { value: 'UK', viewValue: 'UK' }
  ];
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private resources_Service: ResourcesService
  ) {
    this.resourceProfile = this.fb.group({
      res_name: new FormControl(''),
      res_email_id: new FormControl(''),
      res_user_id: new FormControl(''),
      location: new FormControl(''),
      sso_flag: new FormControl(''),
      role_name: new FormControl('')
    });
    this.userID = localStorage.getItem("UserID")
  }
  ngOnInit() {
    this.resources_Service.GetResource(this.userID).subscribe(data => {
      this.userData = data;
      this.resourceProfile.setValue({
        res_name: this.userData[0].res_name,
        res_email_id: this.userData[0].res_email_id,
        res_user_id: this.userData[0].res_user_id,
        location: this.userData[0].location,
        sso_flag: this.userData[0].sso_flag,
        role_name: this.userData[0].role_name
      });
    })
  }
  ResetPassword() {
    const dialogRef = this.dialog.open(ResetPasswordDailogComponent, {
      width: '350px',
      height: '380px',
    });
  }
  UpdateUser() {
    const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
      width: '480px',
      height: '450px',
      data: { details: this.userData }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'success') {
        // Refresh the data after a successful update
        this.ngOnInit();
      }
    });
  }
}