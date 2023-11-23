import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SkillGroups } from 'src/app/_model/SkillGroups';
import { Client } from 'src/app/_model/client';
import { ClientService } from 'src/app/_services/client.service';
import { CoreService } from 'src/app/_services/core.service';
import { ProjectService } from 'src/app/_services/project.service';
// import { SharedDataService } from 'src/app/_services/shared-data.service';
import { SkillsetService } from 'src/app/_services/skillset.service';
import { Subscription } from 'rxjs';
import { projectFilter } from 'src/app/_model/projectFilter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/home/home.component';
import moment from 'moment';

@Component({
  selector: 'app-add-resource-project-dialog',
  templateUrl: './add-resource-project-dialog.component.html',
  styleUrls: ['./add-resource-project-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class AddResourceProjectDialogComponent {
  [x: string]: any;
  addResource: FormGroup;
  projectStatus!: any[];
  projectType!: any[];
  formdata!: Client;
  resExpansion!: any[];
  isRoleSelected: boolean = false;
  DataofSkillGroup!: any[];
  clientData!:any[];
  projectData!:any[];

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  
  res_id = new FormControl();
  resourceExtensionData!: any[];
  filteredResOptions!: any;
  resexpansionid: any;
  dataofProj!: any[];
  temp: any;
  skillData!: any[];
  allocation: any[] = [0.25, 0.5, 0.75, 1];
  skillSets:any;
  skillset:any;
  data!:any;
  receivedData!: any[];
  allProjects!:any[]
  emptyFilter: projectFilter = {
    client_name:[],
    project_name: [],
    project_status:[1,2,3]
  };
  // private subscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<AddResourceProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataRes: any,
    private route: ActivatedRoute,
    private clientService:ClientService,
    private projectService: ProjectService,
    private skillsetService: SkillsetService,
    private skillSetService: SkillsetService,
    private _coreService: CoreService,
    private fb: FormBuilder,
  ) {
    this.addResource = this.fb.group({
      client_id:new FormControl(),
      project_id: new FormControl(),//this.dataOfProjects.dataOfProjects.project_name
      res_id: new FormControl(),
      skillGroupID: new FormControl(''),
      skillID: new FormControl(''),
      allocation_perc: new FormControl(1),
      start_date: new FormControl(),
      end_date: new FormControl()
    })
    // this.subscription = this.sharedDataService.data$.subscribe((data) => {
    //   console.log(data);
      
    //   this.receivedData = data;
    // });
    
    // this.dataofProj = dataOfProjects;


  }
  ngOnInit() {
    // this.route.queryParamMap.subscribe((params: any) => {
    //   console.log(params);
    //   console.log(params.params.data);
    console.log(this.dataRes.dataOfProjects);
    
    if(Array.isArray(this.dataRes.dataOfProjects)){
      // console.log("UNDEFINED");
      this.data=null
    }
    else{
      // this.data=JSON.parse(params.params.data)
      this.addResource.setValue({
        client_id: this.dataRes.dataOfProjects.client_id,
        project_id: this.dataRes.dataOfProjects.project_id,//this.dataOfProjects.dataOfProjects.project_name
        res_id: null,
        skillGroupID: null,
        skillID: null,
        allocation_perc: 1,
        start_date:this.dataRes.dataOfProjects.start_date,
        end_date: this.dataRes.dataOfProjects.end_date
        // partner_incharge: this.dataOfClient.element.partner_incharge,
        // status: this.dataOfClient.element.status
      });
      
      this.projectService.getProjects(this.dataRes.dataOfProjects.client_id,this.emptyFilter).subscribe(data=>{
        this.projectData=data
      })
    }
      
      // console.log( this.data.client_id);
    
    // console.log(JSON.parse(params.params.data))
  // });
    // console.log(this.data);
    // console.log( this.data.client_id);
    
    
    // this.route.queryParams.subscribe(params => {
    //   console.log(params);
    //   const elementData = JSON.parse(params['data']);      
    //   console.log(elementData);
    //   // Now, you can use the 'elementData' in your component as needed.
    // });
    // this.data=history.state
    // console.log(history.state);

    // console.log(this.data);
    
      
  
    // console.log(this.receivedData);
    
    // console.log(this.dataOfProjects.dataOfProjects);
    
    
    
    this.clientService.getActiveClients().subscribe(data=>{
      this.clientData=data
    })
    this.skillSetService.getSkillSets().subscribe(datas => {
      this.skillSets=datas
    });
    this.skillSetService.getSkillGroups().subscribe(res => {
      this.DataofSkillGroup = res;
    });
  }

  AddResource() {
    console.log( this.addResource.value);
    
    this.temp = this.addResource.value;
    this.temp.res_id = this.resexpansionid;
    this.temp.skill_id = this.skillset[0].skillSetID;
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
    // this.temp.project_id=this.dataOfProjects.dataOfProjects.project_id;
    console.log(this.temp);
    
    this.projectService.AddResource(this.temp).subscribe(
      () => {
        this._coreService.openSnackBar('Resource Added Successfully ', 'done');
        this.addResource.reset();
        this.input.nativeElement.value = '';
        // this.addResource.setValue({
        //   client_id: null,
        //   project_id: null,//this.dataOfProjects.dataOfProjects.project_name
        //   res_id: null,
        //   skillGroupID: null,
        //   skillID: null,
        //   allocation_perc: null,
        //   start_date:null,
        //   end_date: null
        //   // partner_incharge: this.dataOfClient.element.partner_incharge,
        //   // status: this.dataOfClient.element.status
        // });
        // this.dialogRef.close('success');
        this.ngOnInit();
      },
      (error) => {
        if (error.status === 503) {
          this._coreService.openSnackBar('Time period is out of project duration', 'done');
        }
      }
    );
  }
  
  filterRes(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    if (this.resourceExtensionData == null) {
    }
    else {
      this.filteredResOptions = this.resourceExtensionData.filter(o => o.res_name.toLowerCase().includes(filterValue));
      this.resexpansionid = this.filteredResOptions.length == 1 ? this.filteredResOptions[0].res_id : 'undefined'
    }
  }
  onSkillSetSelection(){
    this.skillset=this.skillSets.filter((data:any) => data.skillGroupID === this.addResource.value.skillGroupID && data.skillID === this.addResource.value.skillID);    
    this.skillsetService.getResourceAsPerSkillSet(this.skillset[0].skillSetID).subscribe(data => {
      this.resourceExtensionData=data;
    });
  }
  onSkillGroupSelection() {
    const skillGroupID = Number(this.addResource.get('skillGroupID')?.value);
    const skillGroup: SkillGroups = {
      skillGroupID: skillGroupID,
      skillGroup: ''
    };
    this.skillSetService.getSkillAsPerSkillGroup(skillGroup).subscribe(res => {
      this.skillData = res;
    });
  }
  onClientSelection(){
    const clientID = Number(this.addResource.get('client_id')?.value);
    this.projectService.getProjects(clientID,this.emptyFilter).subscribe(data=>{
      this.projectData=data
    })
  }
  onProjectSelection(){
    const projectID = Number(this.addResource.get('project_id')?.value);
    const projectDetails=this.projectData.find(pd => pd.project_id === projectID)
    this.addResource.patchValue({
      start_date:projectDetails.start_date
    })
    this.addResource.patchValue({
      end_date:projectDetails.end_date
    })

  }
  windowClose(){
    window.close();
  }
}
