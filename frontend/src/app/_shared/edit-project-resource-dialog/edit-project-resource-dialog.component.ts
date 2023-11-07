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
  selector: 'app-edit-project-resource-dialog',
  templateUrl: './edit-project-resource-dialog.component.html',
  styleUrls: ['./edit-project-resource-dialog.component.scss']
})

export class EditProjectResourceDialogComponent {
  [x: string]: any;
  updateResource!: FormGroup;
  projectStatus!: any[];
  projectType!: any[];
  formdata!: Client;
  resExpansion!: any[];
  isRoleSelected: boolean = false;
  DataofSkillGroup!: any[];
  skillSets:any;
  skillGroupID:any;
  skillID:any;

  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  res_id = new FormControl();
  resourceExtensionData!: any[];
  filteredResOptions!: any;
  resexpansionid: any;
  dataofProj!: any[];
  temp: any;
  skillData!: any[];
  allocation: any[] = [0.25, 0.5, 0.75, 1];

  constructor(private projectService: ProjectService,
    // private skillsetService: SkillsetService,
    private skillSetService: SkillsetService,
    private resources_Service: ResourcesService,
    private _coreService: CoreService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProjectResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataOfProjects: any,
  ) {
    this.updateResource = this.fb.group({
      project_id: new FormControl(),
      res_id: new FormControl(),
      // skillGroupID: new FormControl(''),
      skillID: new FormControl(''),
      allocation_perc: new FormControl(),
      start_date: new FormControl(),
      end_date: new FormControl()
    }),
      this.dataofProj = dataOfProjects;
    console.log(this.dataofProj);
  }
  ngOnInit() {


    this.skillSetService.getSkillGroups().subscribe(res => {
      this.DataofSkillGroup = res;
    });
    this.skillSetService.getSkillSets().subscribe(datas => {
      this.skillSets=datas
      console.log(this.skillSets);
      var skillset=this.skillSets.find((ss:any)=>ss.skillSetID== this.dataOfProjects.element.skill_id)
      console.log(skillset);
      this.skillGroupID=skillset.skillGroupID
      this.skillID=skillset.skillID
      console.log(skillset.skillGroupID);
      
      
    });
    this.updateResource.setValue({
      project_id: this.dataOfProjects.element.project_id,
      res_id: this.dataOfProjects.element.res_id,
      start_date: this.dataOfProjects.element.start_date,
      end_date: this.dataOfProjects.element.end_date,
      skillID: this.skillID,
      // skillGroupID: this.skillGroupID,
      
      allocation_perc: this.dataOfProjects.element.allocation_perc,
    });
    this.skillSetService.getActiveSkillSets().subscribe(datas => {
      console.log("qwertyui",datas)
      this.skillData = datas;
    });
    this.skillSetService.getResourceAsPerSkillSet(this.dataOfProjects.element.skill_id).subscribe(data => {
      this.resourceExtensionData = data;
    })
  }

  UpdateResource(element: any) {
    console.log(element)
    console.log(this.updateResource.value);
    this.temp = this.updateResource.value
    console.log(this.temp)
    this.projectService.UpdateResource(element.id, this.temp).subscribe(data => {
      this._coreService.openSnackBar('Project Updated Successfully ', 'done');
      this.updateResource.reset();
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
  // onSkillSetSelection(){
  //   const skillSetID = Number(this.updateResource.get('skill_id')?.value);
  //   this.skillSetService.getResourceAsPerSkillSet(skillSetID).subscribe(data => {
  //     this.resourceExtensionData=data;
  //     console.log("kl",this.resourceExtensionData)
  //   });
  // }
  onSkillGroupSelection() {
    const skillGroupID = Number(this.updateResource.get('skillGroupID')?.value);
    const skillGroup: SkillGroups = {
      skillGroupID: skillGroupID,
      skillGroup: ''
    };
    this.skillSetService.getSkillAsPerSkillGroup(skillGroup).subscribe(res => {
      this.skillData = res;
    });
  }
}