import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { skillsetupdate } from '../../_model/skillsetupdate';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SkillsetService } from '../../_services/skillset.service';
import { CoreService } from 'src/app/_services/core.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-edit-skill-dialog',
  templateUrl: './edit-skill-dialog.component.html',
  styleUrls: ['./edit-skill-dialog.component.scss']
})
export class EditSkillDialogComponent {
  apiData!: any[];
  apiDataa!: any[];
  data: any;
  datas: any;
  skills: FormGroup;
  formdata!: skillsetupdate;
  constructor(frmbuilder: FormBuilder, 
    public dialogRef: MatDialogRef<EditSkillDialogComponent>,
    private skillsetService: SkillsetService,
    private _coreService:CoreService,
    @Inject(MAT_DIALOG_DATA) public dataofskills: any) {
    this.skills = frmbuilder.group({
      skill: new FormControl(''),
      skillGroupID: new FormControl(''),
      Description: new FormControl('')
    })
  }
  ngOnInit() {
    this.skills.setValue({
      skill: this.dataofskills.element.skill,
      skillGroupID: this.dataofskills.element.skillGroupID,
      Description:this.dataofskills.element.description
    });
    this.skillsetService.getSkillGroups().subscribe(data => {
      this.apiData = data;
    })
    this.skillsetService.getSkills().subscribe(datas => {
      this.apiDataa = datas;
    })
  }
  UpdateSkill(skillSetID: number) {
    this.formdata = this.skills.value;
    this.formdata = {
      ...this.skills.value,
      skillSetID: skillSetID
    };
    this.skillsetService.UpdateSkillSet(this.formdata).subscribe(result => {
      this._coreService.openSnackBar("Record Updated Successfully","ok");
      this.skills.reset();
      this.dialogRef.close('success');
    }, (error: HttpErrorResponse) => {
      if (error.status === 502) {
        this._coreService.openSnackBar("Skill already exist in the given skill group");
      }
      else if(error.status === 501) {
        this._coreService.openSnackBar("Can't edit INACTIVE skill");
      }
    })
  }
}
