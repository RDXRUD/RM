import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { Client } from 'src/app/_model/client';
import { ClientService } from 'src/app/_services/client.service';
import { CoreService } from 'src/app/_services/core.service';
import { ProjectService } from 'src/app/_services/project.service';
import { MY_FORMATS } from 'src/app/home/home.component';
@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
 
export class EditProjectDialogComponent {
  [x: string]: any;
  updateProject!: FormGroup;
  projectStatus!:any[];
  projectType!:any[];
  formdata!:Client;
 
 
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  project_manager = new FormControl();
  resourceExtensionData!: any[];
  filteredResOptions!: any;
  resexpansionid:any='undefined';
  dataofProj!:any[];
  temp:any;
  data!:any[];
 
  constructor(private projectService: ProjectService,
    private clientService:ClientService ,
    private _coreService: CoreService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataOfClient: any,
    ){
      this.updateProject=this.fb.group({
      client_id: new FormControl(),
      project_name: new FormControl(),
      project_manager: new FormControl,
      start_date: new FormControl(),
      end_date: new FormControl(),
      project_type: new FormControl(),
      project_status: new FormControl()
      }),
      this.dataofProj=dataOfClient;
    }
  ngOnInit(){
    this.updateProject.setValue({
      client_id: this.dataOfClient.element.client_id,
      project_name: this.dataOfClient.element.project_name,
      project_manager: this.dataOfClient.element.project_manager,
      start_date:this.dataOfClient.element.start_date,
      end_date:this.dataOfClient.element.end_date,
      project_type:this.dataOfClient.element.project_type,
      project_status:this.dataOfClient.element.project_status,
    });
    this.clientService.getClients().subscribe(data=>{
      this.data=data;
    })
    this.projectService.getProjectMangers().subscribe(data => {
      this.resourceExtensionData = data;
    })
    this.projectService.getProjectStatus().subscribe(data=>
      this.projectStatus=data
    )
    this.projectService.getProjectType().subscribe(data=>
      this.projectType=data
    )
 
  }
 
  UpdateProject(element:any) {
 
    this.temp=this.updateProject.value
    console.log(this.temp);
    // this.temp.start_date=new Date(this.temp.start_date.format('YYYY-MM-DD'));
    // console.log(this.temp.start_date);

    if (moment.isMoment(this.temp.end_date)) {
      this.temp.end_date = new Date(this.temp.end_date.format('YYYY-MM-DD'));
    } else {
      this.temp.end_date = this.temp.end_date;
    }
    if (moment.isMoment(this.temp.start_date)) {
      this.temp.start_date = new Date(this.temp.start_date.format('YYYY-MM-DD'));
    } else {
      this.temp.start_date = this.temp.start_date;
    }
    console.log(this.temp);
    
    
    if(this.resexpansionid=='undefined'){
      this.temp.project_manager=element.project_manager
 
    }
    else{
      this.temp.project_manager=this.resexpansionid
    }
    this.projectService.UpdateProject(element.project_id,this.temp).subscribe(data => {
      this._coreService.openSnackBar('Project Updated Successfully ', 'done');
      this.updateProject.reset();
      this.dialogRef.close('success');
      this.ngOnInit();
    })
  }
  filterRes(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredResOptions = this.resourceExtensionData.filter(o => o.res_name.toLowerCase().includes(filterValue));
    this.resexpansionid=this.filteredResOptions.length == 1 ? this.filteredResOptions[0].res_id : 'undefined'
  }
}