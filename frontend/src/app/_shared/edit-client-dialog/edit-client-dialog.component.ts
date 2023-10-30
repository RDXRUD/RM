import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from 'src/app/_model/client';
import { ClientService } from 'src/app/_services/client.service';
import { CoreService } from 'src/app/_services/core.service';

@Component({
  selector: 'app-edit-client-dialog',
  templateUrl: './edit-client-dialog.component.html',
  styleUrls: ['./edit-client-dialog.component.scss']
})

export class EditClientDialogComponent {
  [x: string]: any;
  clientDetails: FormGroup;
  clientStatus:string[] = ["ACTIVE", "INACTIVE"];
  formdata!:Client;

  constructor(private clientService: ClientService ,private _coreService: CoreService,private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataOfClient: any,
    ){
      this.clientDetails=this.fb.group({
        client_name:new FormControl(''),
        partner_incharge:new FormControl(''),
        status:new FormControl('')
      })
    }
  ngOnInit(){
    this.clientDetails.setValue({
      client_name: this.dataOfClient.element.client_name,
      partner_incharge: this.dataOfClient.element.partner_incharge,
      status: this.dataOfClient.element.status
    });
  }
  UpdateClient(client_id:number) {
    this.formdata = this.clientDetails.value;
    this.formdata = {
      ...this.clientDetails.value,
      client_id: client_id
    };
    console.log(client_id,this.formdata);
    this.clientService.UpdateClient(client_id,this.formdata).subscribe(client => {
      this._coreService.openSnackBar("Record Updated Successfully","ok");
      this.clientDetails.reset();
      this.dialogRef.close('success');
    })
  }
}
