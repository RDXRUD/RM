import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { employeeFilters } from '../_model/employeefilters';
import { tasks } from '../_model/tasks';
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
  data: any[] = [];
  locations!: any[];
  skillData!: any[];
  skillDataSorted!: any[];
  formdata!: employeeFilters;
  filteringForm: FormGroup;
  filteringDetails: FormGroup;
  DataofSkillGroup!: any[];
  skillSetID: any;
  dates!: any[];
  columns: string[] = [];
  dataOfAllocation = [];
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
  DetailsdisplayedColumns: string[] = ['res_name', 'email_id', 'client_name', 'project_name', 'skill_group', 'skill', 'start_date', 'end_date'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  currentTab: string = 'Allocation Report';
  temp: any;
  details: any;
  router: any;
  constructor(
    frmbuilder: FormBuilder,
    private allocationService: CrossViewService,
    private skillSetService: SkillsetService,
    private resources_Service: ResourcesService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private detailService: DetailService,
    private _coreService: CoreService,
  ) {
    this.filteringForm = frmbuilder.group({
      res_name: new FormControl([]),
      location: new FormControl(null),
      skillGroupID: new FormControl(''),
      skillID: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
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
      this.data = data;
    });
    this.clientService.getActiveClients().subscribe(data => {
      this.clientData = data;
    });
    this.projectService.getAllProjects().subscribe(data => {
      this.dataProject = data;
    });
  }
  applySortToDataSource() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
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
        if (startDateValue) {
          startDate = new Date(startDateValue.format('YYYY-MM-DD'));
        } else {
          startDate = new Date();
        }
        const startDateString = startDate.toISOString();

        const endDateValue = this.filteringForm.get('endDate')?.value;
        let endDate;
        if (endDateValue) {
          endDate = new Date(endDateValue.format('YYYY-MM-DD'));
        } else {
          endDate = new Date(startDate);
          endDate.setMonth(startDate.getMonth() + 1);
        }
        const endDateString = endDate.toISOString();

        this.filter = this.filteringForm.value;
        this.filter.startDate = startDateString;
        this.filter.endDate = endDateString;
        this.filter.skillSetID = this.skillSetID;

        this.allocationService.getCrossView(this.filteringForm.value).subscribe((response: any) => {
          this.submitClicked = true
          this.dataOfAllocation = [];
          this.displayedColumns = ["res_name", "res_email_id"];
          this.columns = [];
          this.dataOfAllocation = response;
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
      this.details = data;
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
    this.filteringForm.reset();
    this.displayedColumns = []
    this.columns = []
    this.dataOfAllocation = []
  }
  OnResetDetail() {
    this.searchClicked = true;
    this.filteringDetails.reset();
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
      cell.v = date;
      cell.t = 'd';
      }
    }
  }
  exportToExcel(): void {
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
    if (this.filteringDetails.get('client_name') && this.data) {
      if (!this.selectAll) {
        this.filteringDetails.get('client_name')?.patchValue(this.data.map((item) => item.res_id));
        this.selectAll = true
      } else {
        this.filteringDetails.get('client_name')?.patchValue([]);
        this.selectAll = false
      }
    }
  }
  allProjectSelection() {
    if (this.filteringDetails.get('project_name') && this.data) {
      if (!this.selectAll) {
        this.filteringDetails.get('project_name')?.patchValue(this.data.map((item) => item.res_id));
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
}
