import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { matchpassword } from 'src/app/_helpers/matchpassword';
import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { ResourcesService } from 'src/app/_services/resources.service';
import { CoreService } from 'src/app/_services/core.service';
import { reset } from 'src/app/_model/reset';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-reset-password-dailog',
  templateUrl: './reset-password-dailog.component.html',
  styleUrls: ['./reset-password-dailog.component.scss']
})
export class ResetPasswordDailogComponent {
  OnReset!: FormGroup;
  hide = true;
  UserID:any;
  formdata!:reset;
  password = new FormControl('', [
    Validators.required,
  ]);
  confirmPassword = new FormControl('', [
    Validators.required,
  ]);
  constructor(
    private resource_service: ResourcesService,
    public dialogRef: MatDialogRef<ResetPasswordDailogComponent>,
    private _coreService: CoreService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public Data: any)
    { 
    this.OnReset = this.fb.group({
      password: new FormControl('', [Validators.required,]),
      confirmPassword: new FormControl('', [Validators.required,]),
    },
    {
      validators:matchpassword
    });
    this.UserID=localStorage.getItem("UserID")
  }
  ngOnInit() {
  }
  ResetPassword(userID:string) {
        console.log(userID)
        this.formdata = this.OnReset.value;
        this.formdata = {
          ...this.OnReset.value,
          UserID: userID
        };
        console.log(this.formdata);
        this.resource_service.ResetPassword(userID,this.formdata).subscribe(res => {
          this._coreService.openSnackBar("Password Updated Successfully","ok");
          this.OnReset.reset();
          this.dialogRef.close('success');
        }),
        (error:HttpErrorResponse) => {
          if (error.status==505) {
            this._coreService.openSnackBar('Login Again!', 'Ok');
        }
      }
      }
}
