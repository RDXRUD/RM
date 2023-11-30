import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
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
import { SkillsService } from '../_services/skills.service';
import { AllocateResourceDialogComponent } from '../_shared/allocate-resource-dialog/allocate-resource-dialog.component';
import { SpinnerService } from '../_services/spinner.service';
import { AIresourcingService } from '../_services/airesourcing.service';
import { Observable, map } from 'rxjs';



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
filteringAllForm:FormGroup;
  DataofSkillGroup!: any[];
  skillSetID: any;
  dates!: any[];
  columns: string[] = [];
  aicolumns:string[] = [];
  // dataOfAllocation = [];
  dataOfAllocat!: MatTableDataSource<[]>;
  displayedColumns = [...this.columns];
  startDateString !: any;
  Resnames!: any[];
  endDateString!: any;
  filter!: any;
  AIFilter!: any;
  dataProject!: any[];
  clientData: any;
  selectAll: boolean = false;
  submitClicked: boolean = false;
  searchClicked: boolean = false;
  AI_selectAll:boolean = false;
  DetailsdisplayedColumns: string[] = ['sno', 'res_name', 'res_email_id', 'client_name', 'project_name', 'project_managers', 'skillGroup', 'skill', 'start_date', 'end_date'];
  SkillsdisplayedColumns: string[] = ['sno', 'resourceName', 'emailID',  'skillGroup', 'skills'];//,
  aidisplayedColumns:string[] = [...this.aicolumns];
  selectedSkillsData!:any[];
  skillSetData:any;
  skillsData!:any[];
  // dataSource!: MatTableDataSource<any>;
  // @ViewChild('sortData') sortData!: MatSort;
  // 


  
 
  currentTab: string = 'Allocation Report';
  temp: any;
  // details: any;
  Roles: any;
  reportType: any[] = ["Week", "Month", "Quarter", "Year", "Custom"]
  availability:any[]=[0,0.25,0.5,0.75,1]
  isCustom: boolean=false;
  datas: any;
  res: any;
  response: any;
  // skillReport:any;
  @ViewChild('sortAll') sortAll!: MatSort;
  dataOfAllocation: MatTableDataSource<any>=new MatTableDataSource();
  emptyData = new MatTableDataSource([{ empty: "row" }]);

  aiData:any[]=[];
  // aiData:MatTableDataSource<any>=new MatTableDataSource();
  
  detailtReport!: MatTableDataSource<any>;
  @ViewChild('sortProject') sortProject!: MatSort;

  skillReport!: MatTableDataSource<any>;
  @ViewChild('sortSkill') sortSkill!: MatSort;
  // @ViewChild(MatSort) sortSkill!: MatSort;
  
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  projectOnClient!: any[];

  @ViewChild('skillDataRef') skillDataRef: ElementRef|undefined;
  aiMonths!: any[];
  aiWeeks!: any[];
  aiYears!:any[];
  aiQuarters!:any[];

  constructor(
    private cdr: ChangeDetectorRef,
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
    private skillService:SkillsService,
    private spinnerService:SpinnerService,
    private aiService:AIresourcingService
  ) {
    this.Roles = localStorage.getItem("Role")
    this.filteringForm = frmbuilder.group({
      res_name: new FormControl([]),
      location: new FormControl([]),
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
    this.filteringAllForm=frmbuilder.group({
      client_name:new FormControl(),
      project_name:new FormControl(),
      skillGroupID:new FormControl(),
      skillID:new FormControl(),
      location:new FormControl([]),
      startDates: new FormControl(),
      endDates: new FormControl(),
      report_type: new FormControl("Month"),
      availability:new FormControl(0)
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
    this.skillService.getSkillReport().subscribe(response => {
      console.log(response);
      this.response=response;
      this.skillReport = new MatTableDataSource(this.response);
      this.skillReport.sort=this.sortSkill;
      console.log(this.skillReport);
    });
    this.skillSetService.getSkillSets().subscribe(data=>{
      this.skillSetData=data
      console.log(this.skillSetData);
      
    })
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
      console.log(this.spinnerService.isLoading);  

      this.skillSetService.getSkillSets().subscribe(datas => {
        console.log(this.spinnerService.isLoading);  

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
        // this.spinnerService.isLoading.next(false);
        console.log(this.spinnerService.isLoading);
        this.allocationService.getCrossView(this.filteringForm.value).subscribe((response: any) => {
          console.log(this.spinnerService.isLoading);  
          this.submitClicked = true
          // this.dataOfAllocation = [];
          // this.dataOfAllocation = new MatTableDataSource();
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
            // this.dataOfAllocation = response;
            this.dataOfAllocation =  new MatTableDataSource(response)
            // console.log(this.dataOfAllocation[0]);
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
              // this.dataOfAllocation = data
              this.dataOfAllocation =  new MatTableDataSource(data)
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
              // this.dataOfAllocation = data
              this.dataOfAllocation =  new MatTableDataSource(data)
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
              // this.dataOfAllocation = data
              this.dataOfAllocation =  new MatTableDataSource(data)
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
              // this.dataOfAllocation =  data
              this.dataOfAllocation =  new MatTableDataSource(data)
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
          this.dataOfAllocation.sort=this.sortAll
          console.log(this.dataOfAllocation.sort);
          console.log(this.sortAll);
          
          // this.spinnerService.isLoading.next(false);


        }, (error: HttpErrorResponse) => {
          if (error.status === 502) {
            // this.dataOfAllocation = [];
            this.dataOfAllocation = new MatTableDataSource();
            this.submitClicked = true
          }
          // this.spinnerService.isLoading.next(false);

        });
      });
    }
  }

  OnSearch(formdata: any) {
    this.detailService.getDetailView(formdata).subscribe(data => {
      this.detailtReport = new MatTableDataSource(data);
      console.log(this.detailtReport);

      this.searchClicked = true;
      this.submitClicked = true;
    }, (error: HttpErrorResponse) => {
      if (error.status === 502) {
        this.detailtReport = new MatTableDataSource();
        this.detailtReport.sort=this.sortProject
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
      location: [], // Default value for location
      skillGroupID: null, // Default value for skillGroupID
      skillID: null, // Default value for skillID
      startDate: new Date(), // Default value for startDate
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Default value for endDate
      report_type: "Month"
    });
    this.displayedColumns = []
    this.columns = []
    // this.dataOfAllocation = []
    this.dataOfAllocation = new MatTableDataSource;
    this.cdr.detectChanges();
  }
  OnResetDetail() {
    this.searchClicked = true;
    this.filteringDetails.reset({
      res_name: [], // Default value for res_name
      location: [], // Default value for location
      client_name: [], // Default value for client_name
      project_name: [], // Default value for project_name
    });
    this.detailtReport = new MatTableDataSource();
    this.cdr.detectChanges();
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
    const ws3: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableDataArray);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Criteria');
    XLSX.utils.book_append_sheet(wb, ws2, 'Allocation Data_view1');
    XLSX.utils.book_append_sheet(wb, ws3, 'Allocation Data_view2');
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

  skillReportToExcel() {
    const tableElement = document.getElementById('skill_report_data');
    const tableData = XLSX.utils.table_to_sheet(tableElement, { raw: true });
    console.log(tableElement);

    const tableDataArray: any[] = XLSX.utils.sheet_to_json(tableData, { header: 1 });

    const ws1: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(tableDataArray);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, 'Skill Data');

    const fileName = `RM_SkillReport.xlsx`;
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
  AI_allSkillSelection() {
    console.log(this.skillData);

    if (this.filteringAllForm.get('skillID') && this.skillsData) {
      if (!this.AI_selectAll) {
        this.filteringAllForm.get('skillID')?.patchValue(this.skillsData.map((item) => item.skillID));
        this.AI_selectAll = true
        console.log("if");

      } else {
        this.filteringAllForm.get('skillID')?.patchValue([]);
        this.AI_selectAll = false
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
  annouceSortChaange(temp:any){
    console.log(temp);
    console.log(this.detailtReport);

  }
  onClientSelection(){
    const clients = (this.filteringAllForm.get('client_name')?.value);
    console.log("clients",clients);
    console.log(this.dataProject);
   
    this.projectOnClient=this.dataProject.filter(project => project.client_id==clients && (project.project_status === 1 || project.project_status === 2));
    console.log("projectOnClient",this.projectOnClient);
  }
  onSkillGroupSelections() {
    const skillGroupID = (this.filteringAllForm.get('skillGroupID')?.value);
    console.log(skillGroupID);
    
    // const skillGroup: SkillGroups = {
    //   skillGroupID: skillGroupID,
    //   skillGroup: ''
    // };
    this.skillsData=this.skillSetData.filter((skill:any) => skillGroupID.includes(skill.skillGroupID));
    console.log("projectOnClient",this.skillsData);
    // this.skillSetService.getSkillAsPerSkillGroup(skillGroup).subscribe(res => {
    //   this.skillData = res;
    //   this.filteringAllForm.patchValue({
    //     skillID: this.skillData.map(item => item.skillID)
    //   })
    // });
  }
  onProjectSelection(){
    const projectID = Number(this.filteringAllForm.get('project_name')?.value);
    const projectDetails=this.projectOnClient.find(pd => pd.project_id === projectID)
    this.filteringAllForm.patchValue({
      startDates:projectDetails.start_date
      
      
    })
    console.log("datee:",projectDetails.start_date);
    this.filteringAllForm.patchValue({
      endDates:projectDetails.end_date
    })

  }
  AI_OnSubmit(){
    console.log(this.filteringAllForm.value);

    const formValues = Object.values(this.filteringAllForm.value);
    console.log(formValues);
    
    if (formValues.some(value => value === null || value === undefined)) {
      this._coreService.openSnackBar("Form Field can't be left empty");

    } else {

      const startDateValue = this.filteringAllForm.get('startDates')?.value;
      let startDate;
      console.log(this.filteringAllForm.value);
      
      if (moment.isMoment(startDateValue)) {
        startDate = new Date(startDateValue.format('YYYY-MM-DD')).toISOString();
      } else {
        startDate = startDateValue;
      }
      
      const endDateValue = this.filteringAllForm.get('endDates')?.value;
      let endDate;
      if (moment.isMoment(endDateValue)) {
        endDate = new Date(endDateValue.format('YYYY-MM-DD')).toISOString();
      } else {
        endDate = endDateValue;
      }

      // this.filteringAllForm.value.startDates=startDate
      // this.filteringAllForm.value.endDates=endDate

      this.AIFilter=this.filteringAllForm.value
      this.AIFilter.startDate=startDate
      this.AIFilter.endDate=endDate

      console.log(this.AIFilter);
      

      const skillGroupIds=this.filteringAllForm.value.skillGroupID
      const skillIds=this.filteringAllForm.value.skillID
      console.log(skillGroupIds);
      console.log(skillIds);
      
      

      this.skillSetService.getSkillSets().subscribe(datas => {
        const temp = datas.filter(data => skillGroupIds.includes(data.skillGroupID) && skillIds.includes(data.skillID));
        if (temp.length > 0) {
          this.AIFilter.skillSetID= temp.map(item => item.skillSetID);
        }
        console.log(this.AIFilter);
        this.selectedSkillsData=datas.filter(data=>this.AIFilter.skillSetID.includes(data.skillSetID));
        console.log("HEAD",this.selectedSkillsData);
        
        const start_Date=new Date(this.AIFilter.startDate)
        const end_Date=new Date(this.AIFilter.endDate)

        if (this.AIFilter.report_type == "Year") {
          this.AIFilter.startDate = new Date(start_Date.getFullYear(), 0, 1, 12, 0, 0, 0);
          this.AIFilter.endDate = new Date(end_Date.getFullYear(), 11, 31, 23, 59, 59, 999);
        }
        if (this.AIFilter.report_type == "Week") {

          const currentDay = start_Date.getUTCDay();
          const difference = (currentDay - 1 + 7) % 7;
          const mondayDate = new Date(start_Date.setUTCHours(12, 0, 0, 0));
          mondayDate.setUTCDate(start_Date.getUTCDate() - difference);
          this.AIFilter.startDate = mondayDate

          const currentDayy = end_Date.getUTCDay();
          const differ = (7 - currentDayy) % 7;
          const sundayDate = new Date(end_Date.setUTCHours(12, 0, 0, 0));
          sundayDate.setUTCDate(end_Date.getUTCDate() + differ);
          this.AIFilter.endDate = sundayDate;
          console.log(this.AIFilter.endDate);
          
        }
        if (this.AIFilter.report_type == "Month") {
          this.AIFilter.startDate = new Date(start_Date.getFullYear(), start_Date.getMonth(), 1, 12, 0, 0, 0);
          this.AIFilter.endDate = new Date(end_Date.getFullYear(), end_Date.getMonth() + 1, 0, 23, 59, 59, 999);
        }

        if (this.AIFilter.report_type == "Quarter") {
          const startQuarter = Math.floor((start_Date.getMonth() + 3) / 3);
          this.AIFilter.startDate = new Date(start_Date.getFullYear(), (startQuarter - 1) * 3, 1, 12, 0, 0, 0);
          const endQuarter = Math.floor((end_Date.getMonth() + 3) / 3);
          this.AIFilter.endDate = new Date(end_Date.getFullYear(), endQuarter * 3, 0, 23, 59, 59, 999);
        }

        this.aiService.filterAIdata(this.AIFilter).subscribe(data=>{
          console.log(this.aidisplayedColumns);
          if (!(this.Roles.includes('NON ADMIN'))) {
            this.aidisplayedColumns=['sno', 'res_name', 'res_email_id','allocate']
          }
          else {
            this.aidisplayedColumns=['sno', 'res_name', 'res_email_id']
          }

          this.aicolumns=[]
          console.log(data);
          
          
          
          console.log(this.aiData);
          // this.AIdataSource()
          if(this.AIFilter.report_type=="Custom"){
            console.log(this.aidisplayedColumns);
            // this.aidisplayedColumns=[]
            // this.aidisplayedColumns= ['sno', 'res_name', 'res_email_id'];
            console.log(this.aidisplayedColumns);
            if (!(this.Roles.includes('NON ADMIN'))) {
              this.aidisplayedColumns=['sno', 'res_name', 'res_email_id','allocate','availableData']
            }
            else {
              this.aidisplayedColumns=['sno', 'res_name', 'res_email_id','availableData']
            }
            this.aicolumns=[]
            console.log("data",data);
            
            const temp=data.filter((item:any) => item.availableData >=this.AIFilter.availability);
            this.aiSkillDataFilter(temp)
          }
          if(this.AIFilter.report_type=="Month"){
            console.log(this.aidisplayedColumns);
            // this.aidisplayedColumns=[]
            // this.aidisplayedColumns= ['sno', 'res_name', 'res_email_id'];
            console.log(this.aidisplayedColumns);
            
            this.aiService.getMonths().subscribe(data=>{
              this.aiMonths=data
              for (const month of this.aiMonths) {
                this.aicolumns.push(month.monthData)
                this.aidisplayedColumns.push(month.monthData);
              }
              console.log("Months",data);
            })        
            
            this.aiService.getMonthlyData().subscribe(data=>{
              console.log("Monthy",data);
              const temp=data.filter(item =>
                Object.values(item.availableData).every((value:any) => value >=this.AIFilter.availability));
              this.aiSkillDataFilter(temp)
            })
            console.log(this.aidisplayedColumns);
          }
          if(this.AIFilter.report_type=="Week"){
            this.aiService.getWeeks().subscribe(data=>{
              this.aiWeeks=data
              console.log("Weeks",data);
              for (const week of this.aiWeeks) {
                this.aicolumns.push(week.weekData)
                this.aidisplayedColumns.push(week.weekData);
              }
            })
            this.aiService.getWeeklyData().subscribe(data=>{
              console.log("Week",data);
              const temp=data.filter(item =>
                Object.values(item.availableData).every((value:any) => value >=this.AIFilter.availability));
                console.log("temp",temp);
                
              this.aiSkillDataFilter(temp)
            })
          }
          if(this.AIFilter.report_type=="Year"){
            this.aiService.getYears().subscribe(data=>{
              this.aiYears=data
              console.log("Years",data);
              for (const year of this.aiYears) {
                this.aicolumns.push(year.year)
                this.aidisplayedColumns.push(year.year);
              }
            })
            this.aiService.getYearlyData().subscribe(data=>{
              console.log("Yearly",data);
              const temp=data.filter(item =>
                Object.values(item.availableData).every((value:any) => value >=this.AIFilter.availability));
              this.aiSkillDataFilter(temp)
            })
          }
          if(this.AIFilter.report_type=="Quarter"){
            this.aiService.getQuarters().subscribe(data=>{
              this.aiQuarters=data
              console.log("Quarters",data);
              for (const quarter of this.aiQuarters) {
                this.aicolumns.push(quarter.quarterData)
                this.aidisplayedColumns.push(quarter.quarterData);
              }
            })
            this.aiService.getQuarterlyData().subscribe(data=>{
              console.log("Quarterly",data);
              const temp=data.filter(item =>
                Object.values(item.availableData).every((value:any) => value >=this.AIFilter.availability));
              this.aiSkillDataFilter(temp)
            })
          }

          
        })
      })

      

    }

  }

  aiSkillDataFilter(data:any){
    this.aiData=[]
    for (const skill of this.selectedSkillsData) {

      this.skillSetService.getResourceAsPerSkillSet(skill.skillSetID).subscribe(res => {
        console.log("resdata",res);
      const resIds = res.map((item) => item.res_id);
      console.log("resIds",resIds);
      console.log("data",data);
      
      const filteredData = data.filter((item:any) => resIds.includes(item.res_id));
      console.log("filteredData",filteredData);
      this.aiData.push(filteredData)
      console.log("this.aidata",this.aiData);
      
      });
    console.log(data);
    }
  }

  // tempp(data:any){
  //   console.log(data);
  //   this.skillSetService.getResourceAsPerSkillSet(data.skillSetID).subscribe(res => {
  //         console.log("resdata",res);
  //     //     return this.aiData
  //   const filteredData = data.filter((temp: any) => temp.res_id === res.res_id);
  //   console.log(filteredData);
      
  //       });
  // }
  // AIdataSource(id:number){
  //   console.log("ID",id);
    
  //   this.skillSetService.getResourceAsPerSkillSet(id).subscribe(data => {
  //     console.log("resdata",data);
  //     return this.aiData
  //   });
  //   return this.aiData
  // }
  // AIdataSource(skillSetID: number): Observable<any[]> {
  //   // Use skillSetID to fetch or filter data for the given skill set
  //   // Return an Observable that emits the filtered data
  //   return this.filterDataBasedOnSkillSet(skillSetID).pipe(
  //     map(filteredData => {
  //       // Return the filtered data
  //       return filteredData;
  //     })
  //   );
  // }
  
  // filterDataBasedOnSkillSet(skillSetID: number): Observable<any> {
  //   // Use the map operator to transform the data received from the service
  //   return this.skillSetService.getResourceAsPerSkillSet(skillSetID).pipe(
  //     map(data => {
  //       console.log("resdata", data);
  //       // Implement logic to filter your data based on the skill set ID
  //       // Return the filtered data
  //       // Replace YourDataType with the actual type of your data
  //       return this.aiData;
  //     })
  //   );
  // }
  AIallocation(email: any,skillData:any) {
    // this.router.navigate(['/Admin']).then(() => {
    //   this.tabService.setActiveTabIndex(4); // Set the index based on your tab order
    //   console.log(email);
    console.log("skillData",skillData);
    
    const dialogRef = this.dialog.open(AllocateResourceDialogComponent, {
      width: '600px',
      height: '550px',
      data: {
        email: email,
        filterFormData: this.AIFilter,
        skillGroupID:skillData.skillGroupID,
        skillID:skillData.skillID
      }
    

      //   });
    });
  }
  
  AI_OnReset(){
  this.filteringAllForm.reset()
  this.filteringAllForm.patchValue({
    report_type:"Month"
  })
  this.filteringAllForm.patchValue({
    location:[]
  })
  this.filteringAllForm.patchValue({
    availability:0
  })
  this.aiData=[]
  this.selectedSkillsData=[]
  }
  
}
