import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from 'src/app/_model/client';
import { ClientService } from 'src/app/_services/client.service';
import { CoreService } from 'src/app/_services/core.service';
import { ProjectService } from 'src/app/_services/project.service';
import { ResourcesService } from 'src/app/_services/resources.service';
import { SkillsetService } from 'src/app/_services/skillset.service';

@Component({
  selector: 'app-add-resource-project-dialog',
  templateUrl: './add-resource-project-dialog.component.html',
  styleUrls: ['./add-resource-project-dialog.component.scss']
})

export class AddResourceProjectDialogComponent {
  [x: string]: any;
  addResource: FormGroup;
  projectStatus!: any[];
  projectType!: any[];
  formdata!: Client;
  resExpansion!:any[];
  isRoleSelected: boolean = false;

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  res_id = new FormControl();
  resourceExtensionData!: any[];
  filteredResOptions!: any;
  resexpansionid: any;
  dataofProj!: any[];
  temp: any;
  skillData!:any[];
  allocation:any[]=[0.25,0.5,0.75,1];

  constructor(private projectService: ProjectService,private skillsetService: SkillsetService,private skillSetService: SkillsetService,private resources_Service: ResourcesService, private _coreService: CoreService, private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddResourceProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataOfProjects: any,
  ) {
    this.addResource = this.fb.group({
      project_id: new FormControl(),
      res_id: new FormControl(),
      skill_id: new FormControl,
      allocation_perc: new FormControl(),
      start_date: new FormControl(),
      end_date: new FormControl()
    }),
      this.dataofProj = dataOfProjects;
    console.log(this.dataofProj);
  }
  ngOnInit() {
    this.skillSetService.getActiveSkillSets().subscribe(datas => {
      console.log(datas)
      this.skillData = datas;
    })

  }

  AddResource() {
    console.log(this.addResource.value);
    this.temp = this.addResource.value
    this.temp.res_id = this.resexpansionid
    console.log(this.temp)
    this.projectService.AddResource(this.temp).subscribe(data => {
      this._coreService.openSnackBar('Project Added Successfully ', 'done');
      this.addResource.reset();
      this.dialogRef.close('success');
      this.ngOnInit();
    })
  }
  filterRes(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    console.log(filterValue)
    if(this.resourceExtensionData==null){
      console.log("DATA IS NULL")
    }
    else{
    this.filteredResOptions = this.resourceExtensionData.filter(o => o.res_name.toLowerCase().includes(filterValue));
    console.log(this.filteredResOptions)

    console.log(this.filteredResOptions.length == 1 ? this.filteredResOptions[0].res_id : 'undefined');
    this.resexpansionid = this.filteredResOptions.length == 1 ? this.filteredResOptions[0].res_id : 'undefined'
    }
  }
  onSkillSetSelection(){
    
    const skillSetID = Number(this.addResource.get('skill_id')?.value);
    this.skillsetService.getResourceAsPerSkillSet(skillSetID).subscribe(data => {
      this.resourceExtensionData=data;
    });
  }
  }
