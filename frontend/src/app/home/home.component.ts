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
  skillSetID: any;
  dates!: any[];
  columns: string[] = [];
  dataOfAllocation = [];
  displayedColumns = [...this.columns];
  startDateString !: any;
  Resnames!: any[];
  endDateString!: any;
  filter!: any;
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
      res_name: new FormControl([]),
      location: new FormControl(null),
      skillGroupID: new FormControl(''),
      skillID: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
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
    })
  }
  applySortToDataSource() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }
  OnSubmit() {
    this.displayedColumns = []
    this.columns = []
    console.log(this.filteringForm.get('skillGroupID')?.value);
    this.skillSetService.getSkillSets().subscribe(datas => {
      const temp = datas.filter(data => data.skillGroupID === this.filteringForm.get('skillGroupID')?.value && data.skillID === this.filteringForm.get('skillID')?.value)
      if (temp.length > 0) {
        this.skillSetID = temp[0].skillSetID;
      } else {
        this.skillSetID = null;
      }
      console.log("filter", this.filteringForm.value)

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

      console.log("asdfghjkl:", startDateString, endDateString, this.skillSetID);

      this.filter = this.filteringForm.value
      this.filter.startDate = startDateString
      this.filter.endDate = endDateString
      this.filter.skillSetID = this.skillSetID

      console.log("asdfilter", this.filter)
      console.log(this.filteringForm.value)

      this.allocationService.getCrossView(this.filteringForm.value).subscribe((response: any) => {
        this.dataOfAllocation = []
        this.displayedColumns = ["res_name"]
        this.columns = []
        this.dataOfAllocation = response;
        console.log(this.dataOfAllocation);
        this.allocationService.getDates().subscribe(date => {
          this.dates = date;
          console.log("date:", date);

          for (const date of this.dates) {
            console.log("Date:", date.date);
            console.log("Day:", date.day);
            this.columns.push(date.date);
            this.displayedColumns.push(date.date)
          }
        });
      });
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
    this.filteringForm.reset();
    this.displayedColumns = []
    this.columns = []
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

  exportToExcel(): void {
    const formData = this.filteringForm.value;
    const tableElement = document.getElementById('table_data');
    const tableData = XLSX.utils.table_to_sheet(tableElement);

    const StartDate = this.startDateString.split('T')[0];
    const EndDate = this.endDateString.split('T')[0];

    const formDataArray: any[] = [
      ['Resource Name', this.Resnames.join(', ')],
      ['Location', this.locations.filter(loc => loc.id == formData.location)[0].location || ''],
      ['Skill Group', this.DataofSkillGroup.filter(sg => sg.skillGroupID == formData.skillGroupID)[0].skillGroup || ''],
      ['Skill', this.skillData.filter(sg => sg.skillID == formData.skillID)[0].skill || ''],
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

}
