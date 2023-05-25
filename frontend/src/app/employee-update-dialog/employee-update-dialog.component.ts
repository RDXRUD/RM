import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { employeeUpdate } from './employeeUpdate';
import { HttpClient } from '@angular/common/http';
import { EmployeeUpdateService } from './employee-update.service';

@Component({
  selector: 'app-employee-update-dialog',
  templateUrl: './employee-update-dialog.component.html',
  styleUrls: ['./employee-update-dialog.component.scss']
})
export class EmployeeUpdateDialogComponent {
  UpdatedForm: FormGroup;
  empData!: employeeUpdate;
  empDatas!: any[];

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dataOfEmp: any,
    private http: HttpClient,
    private empUpdate: EmployeeUpdateService,) {
    this.UpdatedForm = fb.group({
      resourceName: new FormControl(''),
      taskName: new FormControl(''),
      start: new FormControl(''),
      end: new FormControl('')
    })
  }
  ngOnInit() {
    this.UpdatedForm.setValue({
      resourceName: this.dataOfEmp.dataOfEmployee.resourceName,
    });
    console.log(this.dataOfEmp.dataOfEmployee);
    this.empUpdate.getData().subscribe((data) => {
      console.warn(data);
      this.empDatas = data;
    });
  }
  OnUpdate(resourceName: string) {
    this.empData = {
      ...this.UpdatedForm.value,
      resourceName: resourceName
    };
    console.warn(this.empData);
    this.empUpdate.OnUpdate(this.empData).subscribe((res) => {
      console.warn(res);
    });
  }
};
