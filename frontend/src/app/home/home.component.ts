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
import { AddProjectDialogComponent } from '../_shared/add-project-dialog/add-project-dialog.component';
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
  DetailsdisplayedColumns: string[] = ['res_name', 'email_id', 'client_name', 'project_name','project_manager','skill_group', 'skill', 'start_date', 'end_date'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('sortData') sortData!: MatSort;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  currentTab: string = 'Allocation Report';
  temp: any;
  details: any;
  Roles:any;
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
    this.Roles=localStorage.getItem("Role")
    this.filteringForm = frmbuilder.group({
      res_name: new FormControl([]),
      location: new FormControl(null),
      skillGroupID: new FormControl(''),
      skillID: new FormControl(''),
      startDate: new FormControl(new Date()),
      endDate: new FormControl(new Date(new Date().setMonth(new Date().getMonth() + 1))),
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
  // applySortToDataSource() {
  //   if (this.dataSource) {
  //     this.dataSource.sort = this.sort;
  //   }
  // }
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
        const temp = datas.filter(data => data.skillGroupID === skillGroupID && data.skillID === skillID);
        if (temp.length > 0) {
          this.skillSetID = temp[0].skillSetID;
        } else {
          this.skillSetID = null;
        }

        const names = Array.isArray(this.filteringForm.value.res_name) && this.filteringForm.value.res_name.length > 0 ? this.data.filter((res: any) => this.filteringForm.value.res_name.includes(res.res_id)) : this.data;
        this.Resnames = [...new Set(names.map((data: any) => data.res_name))];
        const startDateValue = this.filteringForm.get('startDate')?.value;
        let startDate;
        
        if (moment.isMoment(startDateValue)) {
          startDate = new Date(startDateValue.format('YYYY-MM-DD'));
        } else {
          startDate = startDateValue;
        }
        const startDateString = startDate.toISOString();

        const endDateValue = this.filteringForm.get('endDate')?.value;
        let endDate;
        if (moment.isMoment(endDateValue)) {
          endDate = new Date(endDateValue.format('YYYY-MM-DD'));
        } else {
          endDate = endDateValue;
        }
        const endDateString = endDate.toISOString();

        this.filter = this.filteringForm.value;
        this.filter.startDate = startDateString;
        this.filter.endDate = endDateString;
        this.filter.skillSetID = this.skillSetID;

        this.allocationService.getCrossView(this.filteringForm.value).subscribe((response: any) => {
          this.submitClicked = true
          this.dataOfAllocation = [];
          console.log(this.Roles);
          if(!(this.Roles.includes('NON ADMIN'))){
            this.displayedColumns = ["res_name", "res_email_id","allocate"];
          }
          else{
            this.displayedColumns = ["res_name", "res_email_id"];
          }
          // this.displayedColumns = ["res_name", "res_email_id","allocate"];
          this.columns = [];
          this.dataOfAllocation = response;
          // this.dataOfAllocat = new MatTableDataSource(response);
          // this.dataOfAllocat.sort=this.sortData;
          this.allocationService.getDates().subscribe(date => {
            this.dates = date;
            for (const date of this.dates) {
              this.columns.push(date.date);
              this.displayedColumns.push(date.date);
            }
          });
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
      this.details=data
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
      skillGroupID: '', // Default value for skillGroupID
      skillID: '', // Default value for skillID
      startDate: new Date(), // Default value for startDate
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default value for endDate
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
    const date="28-Sep-2003"
    console.log("Date:", new Date(date));
    
    const formData = this.filteringForm.value;
    const tableElement = document.getElementById('table_data');
    const tableData = XLSX.utils.table_to_sheet(tableElement);

    for (const cellName in tableData) {
      const cell = tableData[cellName];
      this.removeDayFromDate(cell);
    }
    const StartDate = formData.startDate.split('T')[0];
    const EndDate = formData.endDate.split('T')[0];

    const formDataArray: any[] = [
      ['Resource Name', this.Resnames.join(', ')],
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

  detailReportToExcel(){
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
        this.filteringDetails.get('client_name')?.patchValue(this.clientData.map((item:any) => item.client_id));
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
  navigateToAdmin(email:any) {
    this.router.navigate(['/Admin']).then(() => {
      this.tabService.setActiveTabIndex(4); // Set the index based on your tab order
      console.log(email);
      const dialogRef = this.dialog.open(AllocateResourceDialogComponent, {
        width: '600px',
        height: '550px',
        data:{email}
        
      });
    });
  }
}
