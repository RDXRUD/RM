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
import { CrossViewService } from '../_services/cross-view.service';
import { SkillsetService } from '../_services/skillset.service';
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
  dates!: any[];
  columns: string[] = [];
  dataOfAllocation = [
    // { res_ID: 1, res_name: 'Resource 1', Date_1: 80, Date_2: 60, Date_3: 90 },
    // { res_ID: 2, res_name: 'Resource 2', Date_1: 70, Date_2: 50, Date_3: 85 },
    // { res_ID: 3, res_name: 'Resource 3', Date_1: 80, Date_2: 60, Date_3: 90 },
    // { res_ID: 4, res_name: 'Resource 4', Date_1: 70, Date_2: 50, Date_3: 85 },
  ];
  
  displayedColumns = ['res_name', ...this.columns];
  // dataOfAllocation: any[] = []; // Initialize dataOfAllocation as an empty array
  // displayedColumns: string[] = []; 
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    frmbuilder: FormBuilder,
    private allocationService: CrossViewService,
    private skillSetService: SkillsetService,
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
    // this.dataSource = new MatTableDataSource(this.dataOfAllocation);
  }
  ngOnInit() {
    this.skillSetService.getSkills().subscribe(dataOfSkill => {
      this.skillData = dataOfSkill;
    });


    // Extract column names (dates) from the data

    // console.log(this.displayedColumns);

    const startDate = new Date('2023-11-01');
    const startDateString = startDate.toISOString();
    const endDate = new Date('2023-11-09');
    const endDateString = endDate.toISOString();
    this.allocationService.getCrossView(startDateString, endDateString, 6).subscribe((response: any) => {
      // Your code to handle the response goes here
      // this.columns = Object.keys(response[0]);

      // Use the API response as the table data
      this.dataOfAllocation = response;
      console.log(this.dataOfAllocation);
      
      // this.displayedColumns = ['res_ID', 'res_name', ...this.columns];
      this.allocationService.getDates().subscribe(date=> {
        this.dates = date;
        console.log("date:", date);
  
        // console.log("date:", date.day);
        for (const date of this.dates) {
          console.log("Date:", date.date);
          console.log("Day:", date.day);
          this.columns.push(date.date);
          this.displayedColumns.push(date.date)
        }
        // this.columns = date
        console.log("col:",this.columns);
        
      });
    });
    // this.displayedColumns=this.columns
    console.log("uniqueDates",this.displayedColumns);


  }
      applySortToDataSource() {
    // if (this.dataSource) {
    //   this.dataSource.sort = this.sort;
    // }
  }
  OnSubmit() {
  }
  OnReset() {
    // this.filteringForm.reset();
    // this.applySortToDataSource();
  }
}
