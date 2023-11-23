import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { CrossViewService } from '../_services/cross-view.service';
import { SkillsetService } from '../_services/skillset.service';
import { SkillGroups } from '../_model/SkillGroups';
import { ResourcesService } from '../_services/resources.service';
import * as XLSX from 'xlsx';
import { ClientService } from '../_services/client.service';
import { ProjectService } from '../_services/project.service';
import { DetailService } from '../_services/detail.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTabGroup } from '@angular/material/tabs';
import { CoreService } from '../_services/core.service';
import moment from 'moment';
import { Router } from '@angular/router';
import { SharedDataService } from '../_services/shared-data.service';
import { MatDialog } from '@angular/material/dialog';
import { AllocateResourceDialogComponent } from '../_shared/allocate-resource-dialog/allocate-resource-dialog.component';


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
  utc: {
    dateInput: 'YYYY-MM-DDTHH:mm:ss[Z]', // Add the UTC format here
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
  data: any[] = [];
  locations!: any[];
  skillData!: any[];
  filteringForm: FormGroup;
  filteringDetails: FormGroup;
  DataofSkillGroup!: any[];
  skillSetID: any;
  dates!: any[];
  columns: string[] = [];
  dataOfAllocation = [];
  dataOfAllocat!: MatTableDataSource<[]>;
  displayedColumns = [...this.columns];
  startDateString !: any;
  Resnames!: any[];
  endDateString!: any;
  filter!: any;
  dataProject!: any[];
  clientData: any;
  selectAll: boolean = false;
  submitClicked: boolean = false;
  searchClicked: boolean = false;
  DetailsdisplayedColumns: string[] = ['sno', 'res_name', 'email_id', 'client_name', 'project_name', 'project_manager', 'skill_group', 'skill', 'start_date', 'end_date'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('sortData') sortData!: MatSort;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  currentTab: string = 'Allocation Report';
  temp: any;
  details: any;
  Roles: any;
  reportType: any[] = ["Week", "Month", "Quarter", "Year", "Custom"]
  isCustom: boolean=false;
  // dataOfAllocation!: MatTableDataSource<any[]>;
  // @ViewChild('sortAll') sortAll!: MatSort;

  constructor(
    private dialog: MatDialog,
    private tabService: SharedDataService,
    private router: Router,
    private el: ElementRef,
    frmbuilder: FormBuilder,
    private allocationService: CrossViewService,
    private skillSetService: SkillsetService,
    private resources_Service: ResourcesService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private detailService: DetailService,
    private _coreService: CoreService,
  ) {
    this.Roles = localStorage.getItem("Role")
    this.filteringForm = frmbuilder.group({
      res_name: new FormControl([]),
      location: new FormControl(null),
      skillGroupID: new FormControl(),
      skillID: new FormControl(),
      startDate: new FormControl(new Date()),
      endDate: new FormControl(new Date(new Date().setMonth(new Date().getMonth() + 3))),
      report_type: new FormControl("Month")
    });
    this.filteringDetails = frmbuilder.group({
      res_name: new FormControl([]),
      location: new FormControl(null),
      client_name: new FormControl([]),
      project_name: new FormControl([]),
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
      this.data = data.sort((a, b) => a.res_name.toLowerCase().localeCompare(b.res_name.toLowerCase()));
    });
    this.clientService.getActiveClients().subscribe(data => {
      this.clientData = data;
    });
    this.projectService.getAllProjects().subscribe(data => {
      this.dataProject = data;
    });
  }

  OnSubmit() {

    const skillGroupID = this.filteringForm.get('skillGroupID')?.value;
    const skillID = this.filteringForm.get('skillID')?.value;

    if (skillGroupID && !skillID) {
      this._coreService.openSnackBar("Please select both Skill Group and Skill to submit!");
    }
    else {
      this.displayedColumns = [];
      this.columns = [];

      this.skillSetService.getSkillSets().subscribe(datas => {
        const temp = datas.filter(data => data.skillGroupID === skillGroupID && skillID.includes(data.skillID));
        if (temp.length > 0) {
          this.skillSetID = temp.map(item => item.skillSetID);
        } else {
          this.skillSetID = null;
        }
        console.log(this.skillSetID);

        const names = Array.isArray(this.filteringForm.value.res_name) && this.filteringForm.value.res_name.length > 0 ? this.data.filter((res: any) => this.filteringForm.value.res_name.includes(res.res_id)) : this.data;
        this.Resnames = [...new Set(names.map((data: any) => data.res_name))];
        const startDateValue = this.filteringForm.get('startDate')?.value;
        let startDate;
        console.log(this.filteringForm.value);
        
        if (moment.isMoment(startDateValue)) {
          startDate = new Date(startDateValue.format('YYYY-MM-DD'));
        } else {
          startDate = new Date (startDateValue.setHours(12, 0, 0, 0));
        }
        const startDateString = startDate.toISOString();
        console.log(startDateString);
        
        const endDateValue = this.filteringForm.get('endDate')?.value;
        let endDate;
        if (moment.isMoment(endDateValue)) {
          endDate = new Date(endDateValue.format('YYYY-MM-DD'));
        } else {
          endDate = new Date (endDateValue.setHours(12, 0, 0, 0));
        }
        const endDateString = endDate.toISOString();

        this.filter = this.filteringForm.value;
        this.filter.startDate = startDateString;
        this.filter.endDate = endDateString;
        this.filter.skillSetID = this.skillSetID;
        console.log(this.filter);
        console.log(this.filteringForm.value);

        const start_Date=new Date(this.filteringForm.value.startDate)
        const end_Date=new Date(this.filteringForm.value.endDate)
        if (this.filteringForm.value.report_type == "Year") {
          this.filteringForm.value.startDate = new Date(start_Date.getFullYear(), 0, 1, 12, 0, 0, 0);
          this.filteringForm.value.endDate = new Date(end_Date.getFullYear(), 11, 31, 23, 59, 59, 999);
        }
        if (this.filteringForm.value.report_type == "Week") {

          const currentDay = start_Date.getUTCDay();
          const difference = (currentDay - 1 + 7) % 7;
          const mondayDate = new Date(start_Date.setUTCHours(12, 0, 0, 0));
          mondayDate.setUTCDate(start_Date.getUTCDate() - difference);
          this.filteringForm.value.startDate = mondayDate

          const currentDayy = end_Date.getUTCDay();
          const differ = (7 - currentDayy) % 7;
          const sundayDate = new Date(end_Date.setUTCHours(12, 0, 0, 0));
          sundayDate.setUTCDate(end_Date.getUTCDate() + differ);
          this.filteringForm.value.endDate = sundayDate;
          console.log(this.filteringForm.value.endDate);
          
        }
        if (this.filteringForm.value.report_type == "Month") {
          this.filteringForm.value.startDate = new Date(start_Date.getFullYear(), start_Date.getMonth(), 1, 12, 0, 0, 0);
          this.filteringForm.value.endDate = new Date(end_Date.getFullYear(), end_Date.getMonth() + 1, 0, 23, 59, 59, 999);
        }

        if (this.filteringForm.value.report_type == "Quarter") {
          const startQuarter = Math.floor((start_Date.getMonth() + 3) / 3);
          this.filteringForm.value.startDate = new Date(start_Date.getFullYear(), (startQuarter - 1) * 3, 1, 12, 0, 0, 0);
          const endQuarter = Math.floor((end_Date.getMonth() + 3) / 3);
          this.filteringForm.value.endDate = new Date(end_Date.getFullYear(), endQuarter * 3, 0, 23, 59, 59, 999);
        }
        this.allocationService.getCrossView(this.filteringForm.value).subscribe((response: any) => {
          this.submitClicked = true
          this.dataOfAllocation = [];
          console.log(this.Roles);
          if (!(this.Roles.includes('NON ADMIN'))) {
            this.displayedColumns = ["sno", "res_name", "res_email_id", "allocate"];
          }
          else {
            this.displayedColumns = ["sno,res_name", "res_email_id"];
          }
          // this.displayedColumns = ["res_name", "res_email_id","allocate"];
          this.columns = [];
          if (this.filteringForm.value.report_type == "Custom") {
            this.isCustom=true
            this.dataOfAllocation = response;
            console.log(this.dataOfAllocation[0]);
            this.allocationService.getDates().subscribe(date => {
              this.dates = date;
              for (const date of this.dates) {
                this.columns.push(date.date);
                this.displayedColumns.push(date.date);
              }
            });
          }
          if (this.filteringForm.value.report_type == "Week") {
            this.isCustom=false
            this.allocationService.getWeeklyData().subscribe((data: any) => {
              console.log("weekly data", data)
              this.dataOfAllocation = data
              this.allocationService.getWeeks().subscribe(data => {
                console.log("weeks", data);
                for (const week of data) {
                  this.columns.push(week.weekData);
                  this.displayedColumns.push(week.weekData);
                }
                console.log("allocation data", this.dataOfAllocation);
                console.log("columns", this.columns);
              })
            });
          }
          if (this.filteringForm.value.report_type == "Month") {
            this.isCustom=false
            this.allocationService.getMonthlyData().subscribe((data: any) => {
              console.log("Monthly data", data)
              this.dataOfAllocation = data
              this.allocationService.getMonths().subscribe(data => {
                console.log("Months", data);
                for (const month of data) {
                  this.columns.push(month.monthData);
                  this.displayedColumns.push(month.monthData);
                }
                console.log("allocation data", this.dataOfAllocation);
                console.log("columns", this.columns);
              })
            });
          }
          if (this.filteringForm.value.report_type == "Quarter" && this.submitClicked) {
            this.isCustom=false
            this.allocationService.getQuarterlyData().subscribe((data: any) => {
              console.log("Quarterly data", data)
              this.dataOfAllocation = data
              this.allocationService.getQuarters().subscribe(data => {
                console.log("Months", data);
                for (const quarter of data) {
                  this.columns.push(quarter.quarterData);
                  this.displayedColumns.push(quarter.quarterData);
                }
                console.log("allocation data", this.dataOfAllocation);
                console.log("columns", this.columns);
              })
            });
          }
          if (this.filteringForm.value.report_type == "Year" && this.submitClicked) {
            this.isCustom=false
            this.allocationService.getYearlyData().subscribe((data: any) => {
              console.log("Yearly data", data)
              this.dataOfAllocation = data
              this.allocationService.getYears().subscribe(data => {
                console.log("Years", data);
                for (const year of data) {
                  this.columns.push(year.year);
                  this.displayedColumns.push(year.year);
                }
                console.log("allocation data", this.dataOfAllocation);
                console.log("columns", this.columns);
              })
            });
          }

        }, (error: HttpErrorResponse) => {
          if (error.status === 502) {
            this.dataOfAllocation = [];
            this.submitClicked = true
          }

        });
      });
    }
  }

  OnSearch(formdata: any) {
    this.detailService.getDetailView(formdata).subscribe(data => {
      this.details = data
      console.log(this.details);

      this.searchClicked = true;
    }, (error: HttpErrorResponse) => {
      if (error.status === 502) {
        this.details = [];
        this._coreService.openSnackBar("No Records Found!");
      }
    })
  }
  getCellStyle(value: number): any {
    if (value > 1) {
      return { 'background-color': 'red', color: 'white' };
    } else if (value < 1 && value > -1) {
      return { 'background-color': 'lightgreen' };
    } else {
      return {}
    }
  }

  OnReset() {
    this.submitClicked = false
    this.filteringForm.reset({
      res_name: [], // Default value for res_name
      location: null, // Default value for location
      skillGroupID: null, // Default value for skillGroupID
      skillID: null, // Default value for skillID
      startDate: new Date(), // Default value for startDate
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Default value for endDate
      report_type: "Month"
    });
    this.displayedColumns = []
    this.columns = []
    this.dataOfAllocation = []
  }
  OnResetDetail() {
    this.searchClicked = true;
    this.filteringDetails.reset({
      res_name: [], // Default value for res_name
      location: null, // Default value for location
      client_name: [], // Default value for client_name
      project_name: [], // Default value for project_name
    });
    this.details = [];
  }
  onSkillGroupSelection() {
    const skillGroupID = Number(this.filteringForm.get('skillGroupID')?.value);
    const skillGroup: SkillGroups = {
      skillGroupID: skillGroupID,
      skillGroup: ''
    };
    this.skillSetService.getSkillAsPerSkillGroup(skillGroup).subscribe(res => {
      this.skillData = res;
      this.filteringForm.patchValue({
        skillID: this.skillData.map(item => item.skillID)
      })
    });
  }
  removeDayFromDate(cell: XLSX.CellObject) {
    if (typeof cell.v === 'string') {
      const vAsString = cell.v as string;
      const dateMatch = vAsString.match(/^\w{3} \d{2}-[A-Za-z]{3}-\d{4}$/);
      if (dateMatch) {
        const datePart = dateMatch[0].split(' ')[1];
        const date = new Date(datePart);
        console.log(date);

        cell.v = date;
        cell.t = 'd';
      }
    }
  }
  //   formatDate(date:any) {
  //     return date.toLocaleDateString('en-US', {
  //         day: '2-digit',
  //         month: 'short',
  //         year: 'numeric'
  //     });
  // }
  exportToExcel(): void {

    const formData = this.filteringForm.value;
    const tableElement = document.getElementById('table_data');
    const tableData = XLSX.utils.table_to_sheet(tableElement,{ raw: true });

    let StartDate
    let EndDate
    if(this.isCustom){
      for (const cellName in tableData) {
        const cell = tableData[cellName];
        this.removeDayFromDate(cell);
      }
      StartDate = formData.startDate.split('T')[0];
      EndDate = formData.endDate.split('T')[0];
    }
    else{
      StartDate = formData.startDate.toISOString().split('T')[0];
      EndDate = formData.endDate.toISOString().split('T')[0];
    }
    console.log(formData.startDate);
    
    // const StartDate = formData.startDate.split('T')[0];
    // const EndDate = formData.endDate.split('T')[0];
    // console.log(this.filteringForm.value.res_name);

    const formDataArray: any[] = [
      ['Resource Name', this.filteringForm.value.res_name.length ? this.Resnames.join(', ') : this.filteringForm.value.res_name.join(', ')],
      ['Location', this.locations.find(loc => loc.id == formData.location)?.location || ''],
      ['Skill Group', (this.DataofSkillGroup.find(sg => sg.skillGroupID == formData.skillGroupID)?.skillGroup ?? '') || ''],
      ['Skill', (this.skillData && this.skillData.length > 0 ? (this.skillData.find(sg => sg.skillID == formData.skillID) || {}).skill : '') || ''],
      ['Start Date', StartDate],
      ['End Date', EndDate],
    ];

    const tableDataArray: any[] = XLSX.utils.sheet_to_json(tableData, { header: 1 });
    const verticalData = tableDataArray[0].map((col: any, i: any) => [...tableDataArray.map(row => row[i])]);

    const ws1: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(formDataArray);
    const ws2: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(verticalData);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Criteria');
    XLSX.utils.book_append_sheet(wb, ws2, 'Allocation Data');

    const fileName = `RM_${StartDate}_${EndDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  convertToDate(cell: XLSX.CellObject) {
    if (typeof cell.v === 'string') {
      const vAsString = cell.v as string;
      const dateMatch = vAsString.match(/^\d{2}-[A-Za-z]{3}-\d{4}$/);
      if (dateMatch) {
        const datePart = dateMatch[0];
        const date = new Date(datePart);
        cell.v = date;
        cell.t = 'd';
      }
    }
  }

  detailReportToExcel() {
    const formData = this.filteringDetails.value;
    const tableElement = document.getElementById('detail_report_data');
    const tableData = XLSX.utils.table_to_sheet(tableElement, { raw: true });
    console.log(tableElement);

    for (const cellName in tableData) {
      const cell = tableData[cellName];
      this.convertToDate(cell);
    }
    // Iterate through the cells in the G column (excluding G1) and convert date format

    // const cellAddress = 'G2';
    // tableData[cellAddress].z = 'dd-mmm-yyyy';

    const rNames = Array.isArray(formData.res_name) && formData.res_name.length > 0 ? this.data.filter((res: any) => formData.res_name.includes(res.res_id)) : [];
    const resNames = [...new Set(rNames.map((data: any) => data.res_name))];

    const cNames = Array.isArray(formData.client_name) && formData.client_name.length > 0 ? this.clientData.filter((cli: any) => formData.client_name.includes(cli.client_id)) : [];
    const clientNames = [...new Set(cNames.map((data: any) => data.client_name))];

    const pNames = Array.isArray(formData.project_name) && formData.project_name.length > 0 ? this.dataProject.filter((proj: any) => formData.project_name.includes(proj.project_id)) : [];
    const projectNames = [...new Set(pNames.map((data: any) => data.project_name))];

    console.log(tableData);
    console.log(projectNames);


    // for (const cellName in tableData) {
    //   const cell = tableData[cellName];
    //   this.removeDayFromDate(cell);
    // }
    // const StartDate = formData.startDate.split('T')[0];
    // const EndDate = formData.endDate.split('T')[0];

    const formDataArray: any[] = [
      ['Resource Name', resNames.join(', ')],
      ['Location', this.locations.find(loc => loc.id == formData.location)?.location || ''],
      ['Client Name', clientNames.join(', ')],
      ['Project Name', projectNames.join(', ')],
    ];

    const tableDataArray: any[] = XLSX.utils.sheet_to_json(tableData, { header: 1 });
    // const verticalData = tableDataArray[0].map((col: any, i: any) => [...tableDataArray.map(row => row[i])]);

    const ws1: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(formDataArray);
    const ws2: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableDataArray);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Criteria');
    XLSX.utils.book_append_sheet(wb, ws2, 'Detail Data');

    const fileName = `RM_DetailReport.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  toggleAllSelection() {
    if (this.filteringForm.get('res_name') && this.data) {
      if (!this.selectAll) {
        this.filteringForm.get('res_name')?.patchValue(this.data.map((item) => item.res_id));
        this.selectAll = true
      } else {
        this.filteringForm.get('res_name')?.patchValue([]);
        this.selectAll = false
      }
    }
  }
  allSkillSelection() {
    console.log(this.skillData);

    if (this.filteringForm.get('skillID') && this.skillData) {
      if (!this.selectAll) {
        this.filteringForm.get('skillID')?.patchValue(this.skillData.map((item) => item.skillID));
        this.selectAll = true
        console.log("if");

      } else {
        this.filteringForm.get('skillID')?.patchValue([]);
        this.selectAll = false
        console.log("else");

      }
    }
  }
  allSelection() {
    if (this.filteringDetails.get('res_name') && this.data) {
      if (!this.selectAll) {
        this.filteringDetails.get('res_name')?.patchValue(this.data.map((item) => item.res_id));
        this.selectAll = true
      } else {
        this.filteringDetails.get('res_name')?.patchValue([]);
        this.selectAll = false
      }
    }
  }
  allClientSelection() {
    if (this.filteringDetails.get('client_name') && this.clientData) {
      if (!this.selectAll) {
        this.filteringDetails.get('client_name')?.patchValue(this.clientData.map((item: any) => item.client_id));
        this.selectAll = true
      } else {
        this.filteringDetails.get('client_name')?.patchValue([]);
        this.selectAll = false
      }
    }
  }
  allProjectSelection() {
    if (this.filteringDetails.get('project_name') && this.dataProject) {
      if (!this.selectAll) {
        this.filteringDetails.get('project_name')?.patchValue(this.dataProject.map((item) => item.project_id));
        this.selectAll = true
      } else {
        this.filteringDetails.get('project_name')?.patchValue([]);
        this.selectAll = false
      }
    }
  }
  selectTab(index: number, email: any): void {
    var resource = this.data.find(res => res.res_email_id === email);
    this.filteringDetails.setValue({
      res_name: [resource.res_id],
      location: null,
      client_name: [],
      project_name: []
    })

    this.OnSearch(this.filteringDetails.value)
    this.tabGroup.selectedIndex = index;
  }
  navigateToAdmin(email: any) {
    // this.router.navigate(['/Admin']).then(() => {
    //   this.tabService.setActiveTabIndex(4); // Set the index based on your tab order
    //   console.log(email);
    const dialogRef = this.dialog.open(AllocateResourceDialogComponent, {
      width: '600px',
      height: '550px',
      data: { email }

      //   });
    });
  }
}
