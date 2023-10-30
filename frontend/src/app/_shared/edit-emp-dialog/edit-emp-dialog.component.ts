import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/_services/employee.service';
import { CoreService } from 'src/app/_services/core.service';
import { ResourcesService } from 'src/app/_services/resources.service';
interface Location {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-edit-emp-dialog',
  templateUrl: './edit-emp-dialog.component.html',
  styleUrls: ['./edit-emp-dialog.component.scss']
})



export class EditEmpDialogComponent implements OnInit{
  resourceDetails!: FormGroup;
  resdata: any;
  
  locations: Location[] = [
    {value: 'IN', viewValue: 'IN'},
    {value: 'US', viewValue: 'US'},
    {value: 'EU', viewValue: 'EU'},
    {value: 'JP', viewValue: 'JP'},
    {value: 'UK', viewValue: 'UK'}

  ];

  constructor(private resource_service: ResourcesService ,private _coreService: CoreService,private employee_Service: EmployeeService,
    public dialogRef: MatDialogRef<EditEmpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataofresource: any,
    ){
      
    }
  ngOnInit(){
    this.resourceDetails.patchValue(this.dataofresource);
  }

  UpdateRes() {

  }
}


