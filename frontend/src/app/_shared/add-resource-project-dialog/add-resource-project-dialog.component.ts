import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SkillGroups } from 'src/app/_model/SkillGroups';
import { Client } from 'src/app/_model/client';
import { CoreService } from 'src/app/_services/core.service';
import { ProjectService } from 'src/app/_services/project.service';
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


  }
  ngOnInit() {
    this.skillSetService.getSkillSets().subscribe(datas => {
      this.skillSets=datas
    });
    this.skillSetService.getSkillGroups().subscribe(res => {
      this.DataofSkillGroup = res;
    });
  }

  AddResource() {
    this.temp = this.addResource.value;
    this.temp.res_id = this.resexpansionid;
    this.temp.skill_id = this.skillset[0].skillSetID;
    this.projectService.AddResource(this.temp).subscribe(
      () => {
        this._coreService.openSnackBar('Project Added Successfully ', 'done');
        this.addResource.reset();
        this.dialogRef.close('success');
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
}
