import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { employeeFilters } from '../_model/employeefilters';
import { tasks } from '../_model/tasks';
import { elementAt } from 'rxjs';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'DD',
    monthYearA11yLabel: 'MMM YYYY',
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
  tasks!: tasks;
  dataOfSkill: any;
  data: any;
  skillData!: any[];
  skillDataSorted!: any[];
  formdata!: employeeFilters;
  filteringForm: FormGroup;
  displayedColumns: string[] = ['res_ID', 'res_name', 'allocation'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    frmbuilder: FormBuilder
  ) {
    this.filteringForm = frmbuilder.group({
      name: new FormControl(),
      emailID: new FormControl(),
      taskName: new FormControl(),
      skill: new FormControl(),
      assignedFrom: new FormControl(),
      assignedTo: new FormControl(),
      availableFrom: new FormControl()
    });
  }
  ngOnInit() {

  }
  applySortToDataSource() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
  OnSubmit() {
  }
  OnReset() {
    this.filteringForm.reset();
    this.applySortToDataSource();
  }

  array:any=[
    {
      Name: "A",
      Address: "Add1",
    },
    {
      Name: "B",
      Address: "Add2",
    }
  ]
  tabKey:any = [];
  tabValue:any = [];

  getdat(){
    this.array.forEach((element:any)=>{
      this.tabKey = Object.keys(element);
      this.tabValue.push(Object.values(element));
    })
  }
}
