
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
import { ResourcesService } from 'src/app/_services/resources.service';
import { SkillsService } from 'src/app/_services/skills.service';
import { projectFilter } from 'src/app/_model/projectFilter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter , MatMomentDateModule} from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/home/home.component';
import moment from 'moment';

@Component({
  selector: 'app-allocate-resource-dialog',
  templateUrl: './allocate-resource-dialog.component.html',
  styleUrls: ['./allocate-resource-dialog.component.scss']
  ,
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  //   },
  //   //  { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  // ],
})

export class AllocateResourceDialogComponent {
  [x: string]: any;
  allocateResource: FormGroup;
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
  resourceData!:any[]
  resSkillData!:any
  skillgroupData!:any
  emptyFilter: projectFilter = {
    client_name:[],
    project_name: [],
    project_status:[1,2,3]
  };
  // private subscription: Subscription;

  constructor(
    private skillService:SkillsService,
    public dialogRef: MatDialogRef<AllocateResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataRes: any,
    private resourceService:ResourcesService,
    private route: ActivatedRoute,
    private clientService:ClientService,
    private projectService: ProjectService,
    // private skillsetService: SkillsetService,
    private skillSetService: SkillsetService,
    private _coreService: CoreService,
    private fb: FormBuilder,
  ) {
    this.allocateResource = this.fb.group({
      client_id:new FormControl(),
      project_id: new FormControl(),//this.dataOfProjects.dataOfProjects.project_name
      res_id: new FormControl(),
      skillGroupID: new FormControl(''),
      skillID: new FormControl(''),
      allocation_perc: new FormControl(),
      // start_date: new FormControl(),
      // end_date: new FormControl()
      start_date: new FormControl(""),
      end_date: new FormControl("")
    })
    // this.subscription = this.sharedDataService.data$.subscribe((data) => {
    //   console.log(data);
      
    //   this.receivedData = data;
    // });
    
    // this.dataofProj = dataOfProjects;

    
  }
  ngOnInit() {
    this.resourceService.getResources().subscribe(data=>{
      this.resourceData=data
      if(this.dataRes.filterFormData){
        this.projectService.getProjects(this.dataRes.filterFormData.client_name,this.emptyFilter).subscribe(data=>{
          this.projectData=data
        })
        this.projectService.getProjects(this.dataRes.filterFormData.client_name,this.emptyFilter).subscribe(data=>{
          this.projectData=data
        })

        console.log("this.dataRes.filterFormData 123: ",this.dataRes.filterFormData.startDates);


        // this.allocateResource.controls['start_date'].setValue("2023-10-04T00:00:00")
        // this.allocateResource.controls['end_date'].setValue("2023-12-15T00:00:00")
        // this.allocateResource.get('start_date') = "2023-10-04T00:00:00";
        // this.allocateResource.controls['end_date'].setValue("2023-12-15T00:00:00")
        
        this.allocateResource.setValue({
          res_id: this.resourceData.find(res=>res.res_email_id==this.dataRes.email).res_id,
          client_id: this.dataRes.filterFormData.client_name,
          project_id: this.dataRes.filterFormData.project_name,
          skillGroupID: this.dataRes.skillGroupID,
          skillID: this.dataRes.skillID,
          allocation_perc: 1,
          // start_date: this.dataRes.filterFormData.startDate,
          // end_date: this.dataRes.filterFormData.endDate
          start_date: this.dataRes.filterFormData.startDates,
          end_date: this.dataRes.filterFormData.endDates
          // start_date:  "2023-10-04T00:00:00",
          // end_date: "2023-12-15T00:00:00"
        })
        this.onClientSelection()
        this.allocateResource.patchValue({
          project_id: this.dataRes.filterFormData.project_name
        })
        this.onSkillGroupSelection()
        this.allocateResource.patchValue({
          skillID: this.dataRes.skillID
        })
      }
        else{
          this.allocateResource.patchValue({
            res_id: this.resourceData.find(res=>res.res_email_id==this.dataRes.email).res_id,
          });
          this.allocateResource.patchValue({
            allocation_perc: 1,
          });
        }

        console.log("this.allocateResource 151: ",this.allocateResource.value);
  });
    
    
    // this.route.queryParamMap.subscribe((params: any) => {
    //   console.log(params);
    //   console.log(params.params.data);
      
    // if(params.params.data===undefined){
    //   console.log("UNDEFINED");
    //   this.data=null
    // }
    // else{
    //   this.data=JSON.parse(params.params.data)
      
      // this.projectService.getProjects(this.data.client_id).subscribe(data=>{
      //   this.projectData=data
      // })
      
    
      
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
    this.skillSetService.getSkillGroups().subscribe(res => {
    this.DataofSkillGroup = res;  
    const encodedEmailID = encodeURIComponent(this.dataRes.email);
    this.skillService.getSkill(encodedEmailID).subscribe(datas => {
      console.log(datas);
      console.log("data:",this.dataRes)
      console.log(this.DataofSkillGroup);
      this.resSkillData=datas
      const intersection = this.DataofSkillGroup.filter(skillGroup =>
        datas.some((resSkill:any) => resSkill.skillGroupID === skillGroup.skillGroupID)
      );
      this.skillgroupData=intersection
            console.log(intersection);
      
      
    });
    })
    
    this.clientService.getActiveClients().subscribe(data=>{
      this.clientData=data
    })
    this.skillSetService.getSkillSets().subscribe(datas => {
      this.skillSets=datas
    });
    console.log("data:",this.dataRes.email)
    // const valiGroups=this.DataofSkillGroup.skillgroupID.intersect(this.resSkillData.skillGroupID)

    
  }

  AddResource() {
    console.log( this.allocateResource.value);
    console.log("md",this.resSkillData);
    
    this.temp = this.allocateResource.value;
    this.temp.res_id = this.resSkillData[0].resourceID;
    this.temp.skill_id = this.temp.skillID;

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
    // console.log(this.temp);
    
    this.projectService.AddResource(this.temp).subscribe(
      () => {
        this._coreService.openSnackBar('Resource Added Successfully ', 'done');
        this.allocateResource.reset();
        // this.input.nativeElement.value = '';
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
  
  // filterRes(): void {
  //   this.filteredResOptions=this.resourceData
  //   const filterValue = this.input.nativeElement.value.toLowerCase();
  //   if (this.resourceData == null) {
  //   }
  //   else {
  //     this.filteredResOptions = this.resourceData.filter(o => o.res_name.toLowerCase().includes(filterValue));
  //     this.resexpansionid = this.filteredResOptions.length == 1 ? this.filteredResOptions[0].res_id : 'undefined'
  //   }
  // }
  // onSkillSetSelection(){
  //   this.skillset=this.skillSets.filter((data:any) => data.skillGroupID === this.allocateResource.value.skillGroupID && data.skillID === this.allocateResource.value.skillID);    
  //   this.skillSetService.getResourceAsPerSkillSet(this.skillset[0].skillSetID).subscribe(data => {
  //     this.resourceExtensionData=data;
  //   });
  // }
  onSkillGroupSelection() {
    const skillGroupID = Number(this.allocateResource.get('skillGroupID')?.value);
    const skillGroup: SkillGroups = {
      skillGroupID: skillGroupID,
      skillGroup: ''
    };
    this.skillSetService.getSkillAsPerSkillGroup(skillGroup).subscribe(res => {
      console.log(res);
      
      this.skillData = res;
      console.log(this.skillData);
      const intersection = this.skillData.filter(skill =>
        this.resSkillData.some((resSkill:any) => resSkill.skillID === skill.skillID)
      );
      this.skillData=intersection
    });
  }
  onClientSelection(){
    const clientID = Number(this.allocateResource.get('client_id')?.value);
    this.allocateResource.patchValue({
      project_id:null
    })
    this.projectService.getProjects(clientID,this.emptyFilter).subscribe(data=>{
      this.projectData=data
    })
  }
  onResourceSelection(){
    const resID = Number(this.allocateResource.get('res_id')?.value);
    const resEmailID=this.resourceData.find(res=>res.res_id==resID).res_email_id
    this.skillService.getSkill(resEmailID).subscribe(datas => {
      this.resSkillData=datas
      console.log("dat",this.resSkillData);
      
      const intersection = this.DataofSkillGroup.filter(skillGroup =>
            datas.some((resSkill:any) => resSkill.skillGroupID === skillGroup.skillGroupID)
          );
          this.skillgroupData=intersection
      console.log(this.resSkillData);
      
    })
    // this.skillSetService.getSkillGroups().subscribe(res => {
    //   this.DataofSkillGroup = res;
    //   console.log(this.DataofSkillGroup);
      
    //   const intersection = this.DataofSkillGroup.filter(skillGroup =>
    //     this.resSkillData.some((resSkill:any) => resSkill.skillGroupID === skillGroup.skillGroupID)
    //   );
    //   console.log(intersection);
      
      
    // });
  }
  onProjectSelection(){
    const projectID = Number(this.allocateResource.get('project_id')?.value);
    const projectDetails=this.projectData.find(pd => pd.project_id === projectID)
    this.allocateResource.patchValue({
      start_date:projectDetails.start_date
    })
    this.allocateResource.patchValue({
      end_date:projectDetails.end_date
    })

  }
  windowClose(){
    window.close();
  }
}
