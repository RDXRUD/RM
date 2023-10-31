import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { editResource } from 'src/app/_model/editResource';
import { CoreService } from 'src/app/_services/core.service';
import { ResourcesService } from 'src/app/_services/resources.service';

@Component({
  selector: 'app-edit-res-dailog',
  templateUrl: './edit-res-dailog.component.html',
  styleUrls: ['./edit-res-dailog.component.scss']
})
export class EditResDailogComponent {
  [x: string]: any;
  resourceDetails: FormGroup;
  roles:any;
  locations: any;
  formdata!:editResource;
  constructor(private resource_service: ResourcesService ,
    private _coreService: CoreService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditResDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataofresource: any,
    ){
      this.resourceDetails=this.fb.group({
        res_name:new FormControl(''),
        res_email_id:new FormControl(''),
        res_user_id:new FormControl(''),
        location:new FormControl(''),
        sso_flag:new FormControl(''),
        role_name:new FormControl('')
      })
    }
  ngOnInit(){
    this.resourceDetails.setValue({
      res_name: this.dataofresource.element.res_name,
      res_email_id: this.dataofresource.element.res_email_id,
      res_user_id: this.dataofresource.element.res_user_id,
      location: this.dataofresource.element.location,
      sso_flag: this.dataofresource.element.sso_flag,
      role_name:this.dataofresource.element.role_name
    });
    this.resource_service.GetLocations().subscribe((data: any) => {
      this.locations = data;
    })
    this.resource_service.GetRoles().subscribe(data => {
      this.roles = data;
    })
  }
  UpdateResource(res_id:number) {
    this.formdata = this.resourceDetails.value;
    this.formdata = {
      ...this.resourceDetails.value,
      res_id: res_id
    };
    this.resource_service.UpdateResource(res_id,this.formdata).subscribe(res => {
      this._coreService.openSnackBar("Record Updated Successfully","ok");
      this.resourceDetails.reset();
      this.dialogRef.close('success');
    })
  }
}
