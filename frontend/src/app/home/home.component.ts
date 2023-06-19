import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UsersService } from '../_services/users.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;
import { employeeFilters } from '../_model/employeefilters';
import { SkillsetService } from '../_services/skillset.service';
import { EmployeeService } from '../_services/employee.service';
import { ViewTasknameDialogComponent } from '../_shared/view-taskname-dialog/view-taskname-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM DD YYYY',
  },
  display: {
    dateInput: ' DD-MMM-YYYY',
    monthYearLabel: ' MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM LL YYYY',
  },
};
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dataOfEmp: any;
  datas: any;
  dataOfSkill:any;
  skillData!: any[];
  skillDataSorted!: any[];
  formdata!: employeeFilters;
  filteringForm: FormGroup;
  displayedColumns: string[] = ['empID', 'resourceName', 'emailID','Viewtasks'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private users_Service: UsersService,
     private frmbuilder: FormBuilder,
    private skillsetService: SkillsetService,
     private employeeService: EmployeeService,
     private dialog:MatDialog) {
    this.filteringForm = frmbuilder.group({
      name: new FormControl(),
      emailID: new FormControl(),
      taskName: new FormControl(),
      skill: new FormControl(),
      assignedFrom: new FormControl(),
      assignedTo: new FormControl(),
      availableFrom: new FormControl()
    })
  }
  ngOnInit() {
    this.employeeService.getDataOfEmployee().subscribe(data => {
      this.dataOfEmp = data
      this.dataSource = new MatTableDataSource(this.dataOfEmp);
      this.dataSource.sort = this.sort;

    })
    this.skillsetService.getSkills().subscribe(dataOfSkill => {
      this.skillData = dataOfSkill;
      this.skillDataSorted = this.skillData.sort((a, b) => a.skill.localeCompare(b.skill));
    })
  }
  OnSubmit() {
    this.formdata = this.filteringForm.value;
    this.formdata.skill = Array.isArray(this.formdata.skill) ? this.formdata.skill.join(',') : this.formdata.skill;
    this.employeeService.FilterEmp(this.formdata).subscribe(datas => {
      this.dataOfEmp = datas
      this.dataSource = new MatTableDataSource(this.dataOfEmp);
    })
  }
  OnReset() {
    this.filteringForm.reset();
    this.ngOnInit();
  }
  OpentaskName(emailID: string) {
    const dialogRef = this.dialog.open(ViewTasknameDialogComponent, {
      data: { emailID }
    });
  }
}