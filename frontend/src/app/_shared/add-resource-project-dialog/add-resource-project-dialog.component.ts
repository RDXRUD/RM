import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SkillGroups } from 'src/app/_model/SkillGroups';
import { Client } from 'src/app/_model/client';
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
  resExpansion!: any[];
  isRoleSelected: boolean = false;
  DataofSkillGroup!: any[];

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

  constructor(
    private resources_Service:ResourcesService,
    private projectService: ProjectService,
    private skillsetService: SkillsetService,
    private skillSetService: SkillsetService,
    private _coreService: CoreService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddResourceProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataOfProjects: any,
  ) {
    this.addResource = this.fb.group({
      project_id: new FormControl(),
      res_id: new FormControl(),
      skillGroupID: new FormControl(''),
      skillID: new FormControl(''),
      allocation_perc: new FormControl(),
      start_date: new FormControl(),
      end_date: new FormControl()
    }),
      this.dataofProj = dataOfProjects;
    console.log(this.dataofProj);


  }
  ngOnInit() {
    // this.skillSetService.getActiveSkillSets().subscribe(datas => {
    //   console.log(datas)
    //   this.skillData = datas;
    // })
    // this.resources_Service.getResources().subscribe(data => {
    // this.resourceExtensionData=data;
    // })
    this.skillSetService.getSkillSets().subscribe(datas => {
      this.skillSets=datas
    });
    this.skillSetService.getSkillGroups().subscribe(res => {
      this.DataofSkillGroup = res;
    });
  }

  AddResource() {
    console.log("value",this.addResource.value);
    this.temp = this.addResource.value
    this.temp.res_id = this.resexpansionid
    this.temp.skill_id=this.skillset[0].skillSetID
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
    if (this.resourceExtensionData == null) {
      console.log("DATA IS NULL")
    }
    else {
      this.filteredResOptions = this.resourceExtensionData.filter(o => o.res_name.toLowerCase().includes(filterValue));
      console.log(this.filteredResOptions)

      console.log(this.filteredResOptions.length == 1 ? this.filteredResOptions[0].res_id : 'undefined');
      this.resexpansionid = this.filteredResOptions.length == 1 ? this.filteredResOptions[0].res_id : 'undefined'
    }
  }
  onSkillSetSelection(){
    this.skillset=this.skillSets.filter((data:any) => data.skillGroupID === this.addResource.value.skillGroupID && data.skillID === this.addResource.value.skillID);
    console.log(this.skillset);
    
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
    console.log(skillGroup);

    this.skillSetService.getSkillAsPerSkillGroup(skillGroup).subscribe(res => {
      this.skillData = res;

    });
    
  }
}
