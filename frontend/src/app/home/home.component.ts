import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UsersService } from './users.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
const moment = _rollupMoment || _moment;
import { employeeFilters } from './employeefilters';

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
  displayedColumns: string[] = ['empID', 'resourceName', 'emailID', 'taskName', 'start', 'finish'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private users_Service: UsersService, private frmbuilder: FormBuilder) {
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
    this.users_Service.getData().subscribe(data => {
      this.dataOfEmp = data
      this.dataSource = new MatTableDataSource(this.dataOfEmp);
      this.dataSource.sort = this.sort;

    })
    this.users_Service.getSkilldata().subscribe(dataOfSkill => {
      this.skillData = dataOfSkill;
      this.skillDataSorted = this.skillData.sort((a, b) => a.skill.localeCompare(b.skill));
    })
  }
  OnSubmit() {
    this.formdata = this.filteringForm.value;
    this.formdata.skill = Array.isArray(this.formdata.skill) ? this.formdata.skill.join(',') : this.formdata.skill;
    this.users_Service.OnSubmit(this.formdata).subscribe(datas => {
      this.dataOfEmp = datas
      this.dataSource = new MatTableDataSource(this.dataOfEmp);
    })
  }
  OnReset() {
    this.filteringForm.reset();
    this.ngOnInit();
  }
}