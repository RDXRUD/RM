import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { resource } from 'src/app/_model/resource';
import { ResourcesService } from 'src/app/_services/resources.service';
import { CoreService } from 'src/app/_services/core.service';
@Component({
  selector: 'app-update-profile-dialog',
  templateUrl: './update-profile-dialog.component.html',
  styleUrls: ['./update-profile-dialog.component.scss']
})
export class UpdateProfileDialogComponent {
  userID: any
  locations: any;
  OnUpdate!: FormGroup;
  formdata!: resource;
  userData!: resource[];
  constructor(
    private resource_service: ResourcesService,
    public dialogRef: MatDialogRef<UpdateProfileDialogComponent>,
    private _coreService: CoreService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public Data: any) {
    this.OnUpdate = this.fb.group({
      res_name: new FormControl(''),
      res_email_id: new FormControl(''),
      location: new FormControl(''),
      sso_flag: new FormControl(''),
      role_name: new FormControl(''),
      res_user_id: new FormControl(''),
    });
    this.userID = localStorage.getItem("UserID")
  }
  ngOnInit() {
    this.OnUpdate.setValue({
      res_name: this.Data.details[0].res_name,
      res_email_id: this.Data.details[0].res_email_id,
      location: this.Data.details[0].location,
      sso_flag: this.Data.details[0].sso_flag,
      role_name: this.Data.details[0].role_name,
      res_user_id: this.Data.details[0].res_user_id,
    });
    console.log("details:", this.Data.details)
    this.resource_service.GetLocations().subscribe((data: any) => {
      this.locations = data;
      console.log(this.locations);
    });
    console.log(this.Data.details[0].res_id)
  }
  UpdateUser(res_id: number) {
    console.log(res_id)
    this.formdata = this.OnUpdate.value;
    this.formdata = {
      ...this.OnUpdate.value,
      res_id: res_id
    };
    console.log(res_id, this.formdata);
    this.resource_service.UpdateResource(res_id, this.formdata).subscribe(res => {
      this._coreService.openSnackBar("Record Updated Successfully", "ok");
      this.OnUpdate.reset();
      this.dialogRef.close('success');
    })
  }

}