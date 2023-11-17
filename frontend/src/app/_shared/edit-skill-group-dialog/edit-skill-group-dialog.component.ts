import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { skillsetupdate } from '../../_model/skillsetupdate';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SkillsetService } from '../../_services/skillset.service';
import { CoreService } from 'src/app/_services/core.service';
import { HttpErrorResponse } from '@angular/common/http';
import { skillgroup } from 'src/app/_model/skillgroup';
@Component({
  selector: 'app-edit-skill-group-dialog',
  templateUrl: './edit-skill-group-dialog.component.html',
  styleUrls: ['./edit-skill-group-dialog.component.scss']
})
export class EditSkillGroupDialogComponent {
  apiData!: any[];
  apiDataa!: any[];
  data: any;
  datas: any;
  skillGroups: FormGroup;
  formdata!: skillgroup;
  constructor(frmbuilder: FormBuilder, 
    public dialogRef: MatDialogRef<EditSkillGroupDialogComponent>,
    private skillsetService: SkillsetService,
    private _coreService:CoreService,
    @Inject(MAT_DIALOG_DATA) public dataOfGroup: any) {
    this.skillGroups = frmbuilder.group({
      Description: new FormControl('')
    })
  }
  ngOnInit() {
    this.skillGroups.setValue({ 
      Description:this.dataOfGroup.element.description
    });
  }
  updateSkillGroup() {
    this.formdata = this.skillGroups.value;
    this.formdata.skillGroupID=this.dataOfGroup.element.skillGroupID
    console.log(this.formdata);
    
    this.skillsetService.UpdateSkillGroup(this.formdata).subscribe(result => {
      this._coreService.openSnackBar("Record Updated Successfully","ok");
      this.skillGroups.reset();
      this.dialogRef.close('success');
    }, (error: HttpErrorResponse) => {
      if (error.status === 501) {
        this._coreService.openSnackBar("Can't edit INACTIVE Skill Group");
      }
    })
  }
}
