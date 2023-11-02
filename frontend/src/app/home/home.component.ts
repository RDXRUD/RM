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
import { SkillGroups } from '../_model/SkillGroups';
import { ResourcesService } from '../_services/resources.service';
import * as XLSX from 'xlsx';

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
  locations!: any[];
  skillData!: any[];
  skillDataSorted!: any[];
  formdata!: employeeFilters;
  filteringForm: FormGroup;
  DataofSkillGroup!: any[];
  skillSetID:any;
  dates!: any[];
  columns: string[] = [];
  dataOfAllocation = [];
  displayedColumns = [ ...this.columns];
  fileName = 'ExportExce.xlsx';
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  temp: any;
  constructor(
    frmbuilder: FormBuilder,
    private allocationService: CrossViewService,
    private skillSetService: SkillsetService,
    private resources_Service: ResourcesService,
  ) {
    this.filteringForm = frmbuilder.group({
      skillGroupID: new FormControl(),
      skillID: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
    });
  }
  ngOnInit() {
    this.skillSetService.getSkillGroups().subscribe(res => {
      this.DataofSkillGroup = res;
    });
    this.resources_Service.GetLocations().subscribe(data => {
      this.locations = data;
    });
    this.resources_Service.getResources().subscribe(data => {
      this.data = data;
      // this.resourceExtensionData = data;
    })
  }
      applySortToDataSource() {
    // if (this.dataSource) {
    //   this.dataSource.sort = this.sort;
    // }
  }
  OnSubmit() {
    this.displayedColumns=["res_name"]
    this.columns=[]
    this.skillSetService.getSkillSets().subscribe(datas => {
      const temp=datas.filter(data => data.skillGroupID === this.filteringForm.get('skillGroupID')?.value && data.skillID === this.filteringForm.get('skillID')?.value)
      console.log(temp[0]);
      this.skillSetID=temp[0].skillSetID;
      console.log("ss",temp[0].skillSetID);
      
    

    const startDate = new Date(this.filteringForm.get('startDate')?.value.format('YYYY-MM-DD'));
    const startDateString = startDate.toISOString();
    const endDate = new Date(this.filteringForm.get('endDate')?.value.format('YYYY-MM-DD'));
    const endDateString = endDate.toISOString();
    console.log("asdfghjkl:",startDateString, endDateString, this.skillSetID);
    
    this.allocationService.getCrossView(startDateString, endDateString, this.skillSetID).subscribe((response: any) => {
      this.dataOfAllocation = response;
      console.log(this.dataOfAllocation);
      this.allocationService.getDates().subscribe(date=> {
        this.dates = date;
        console.log("date:", date);

        for (const date of this.dates) {
          console.log("Date:", date.date);
          console.log("Day:", date.day);
          this.columns.push(date.date);
          this.displayedColumns.push(date.date)
        }
        // console.log("col:",this.columns);
        
      });
    });
  })
  }
  getCellStyle(value: number): any {
    if(value > 1){
      return  { 'background-color': 'red',color: 'white' };
  }else if (value < 1&&value>-1){
    return  { 'background-color': 'lightgreen' };
  }else{
    return {}
  } 
  }

  OnReset() {
    this.filteringForm.reset();
    this.displayedColumns=[]
    this.columns=[]
    // this.applySortToDataSource();
  }
  onSkillGroupSelection() {
    const skillGroupID = Number(this.filteringForm.get('skillGroupID')?.value);
    const skillGroup: SkillGroups = {
      skillGroupID: skillGroupID,
      skillGroup: ''
    };
    this.skillSetService.getSkillAsPerSkillGroup(skillGroup).subscribe(res => {
      this.skillData = res;
    });
  }
  // exportToExcel(): void {
  //   // Create an array to hold the data
  //   const data = [];

  //   // Add headers to the data array
  //   const headers = ['Resource Name', ...this.columns];
  //   data.push(headers);

  //   // Add data rows to the data array
  //   this.dataOfAllocation.forEach((item) => {
  //     const row = [item.res_name];

  //     this.columns.forEach((col) => {
  //       row.push(item.allocationData[col] || 0); // Use 0 if allocationData is undefined
  //     });

  //     data.push(row);
  //   });

  //   // Create a worksheet from the data
  //   const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

  //   // Create a workbook and add the worksheet
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Data');

  //   // Generate the Excel file in memory
  //   const excelBlob = XLSX.write(wb, { bookType: 'xlsx', type: 'blob' });

  //   // Save the Excel file to the user's device using file-saver
  //   saveAs(excelBlob, 'table_data.xlsx');
  // }
  exportToExcel(): void {
    /* pass here the table id */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataOfAllocation);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
}
}
