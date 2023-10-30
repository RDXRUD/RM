import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SkillsService } from '../../_services/skills.service';
import { skillset } from '../../_model/skillset';
import { SkillsetService } from '../../_services/skillset.service';
import { CoreService } from 'src/app/_services/core.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SkillGroups } from 'src/app/_model/SkillGroups';
@Component({
  selector: 'app-edit-emp-skill-dialog',
  templateUrl: './edit-emp-skill-dialog.component.html',
  styleUrls: ['./edit-emp-skill-dialog.component.scss']
})
export class EditEmpSkillDialogComponent {
  data: any;
  datas: any;
  skillgroupskill: FormGroup;
  formdatas!: skillset;
  apiData!: any[];
  apiDataa!: any[];
  DataofSkill: any;
  constructor(
    public dialogRef: MatDialogRef<EditEmpSkillDialogComponent>,
    private skillsService: SkillsService,
    private skillsetService: SkillsetService,
    private frmbuilder: FormBuilder,
    private _coreService:CoreService,
    @Inject(MAT_DIALOG_DATA) public dataOfskills: any,
  ) {
    this.skillgroupskill = frmbuilder.group({
      skillSetID: new FormControl(''),
      skillGroupID: new FormControl(''),
    });
  }
  ngOnInit() {
    this.skillgroupskill.setValue({
      skillGroupID: this.dataOfskills.element.skillGroupID,
      skillSetID: this.dataOfskills.element.skillSetID,
    });
    this.skillsetService.getSkillGroups().subscribe((data) => {
      this.apiData = data;
    });
    this.getSkillSets();
  }
  getSkillSets(){
  this.skillsetService.getActiveSkillSets().subscribe((datas) => {
    console.log("set:",datas)
    console.log( this.dataOfskills.element.skillGroupID)
    this.apiDataa = datas;
    this.filterSkillsBySkillGroup();
  });
}
filterSkillsBySkillGroup() {
  const selectedSkillGroupID = this.skillgroupskill.get('skillGroupID')?.value;
  this.apiDataa = this.apiDataa.filter(item => item.skillGroupID === selectedSkillGroupID);
}

  UpdateSkills(resourceSkillID: number, resourceID: number) {
    this.formdatas = {
      ...this.skillgroupskill.value,
      resourceSkillID: resourceSkillID,
      resourceID: resourceID,
    };
    console.log(this.formdatas)
    this.skillsService.UpdateSkills(this.formdatas).subscribe((res) => {  
      this._coreService.openSnackBar('Record Updated Successfully', 'done')
      this.skillgroupskill.reset();
      this.dialogRef.close('success');
    }, (error: HttpErrorResponse) => {
      if (error.status === 502) {
        this._coreService.openSnackBar("Record is already present!");
      }
    });
  }
}