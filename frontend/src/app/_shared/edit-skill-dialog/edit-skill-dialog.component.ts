import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { skillsetupdate } from '../../_model/skillsetupdate';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SkillsetService } from '../../_services/skillset.service';
import { CoreService } from 'src/app/_services/core.service';

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

  constructor(private frmbuilder: FormBuilder, private fb: FormBuilder, private skillsetService: SkillsetService,private _coreService:CoreService,
    @Inject(MAT_DIALOG_DATA) public dataofskills: any) {
    this.skills = frmbuilder.group({
      skillID: new FormControl(''),
      skillGroupID: new FormControl(''),
    })
  }
  ngOnInit() {
    this.skills.setValue({
      skillID: this.dataofskills.element.skillID,
      skillGroupID: this.dataofskills.element.skillGroupID,
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
    console.warn(this.formdata);
    this.skillsetService.UpdateSkill(this.formdata).subscribe(result => {
      this._coreService.openSnackBar("Record Updated Successfully","ok");
      this.skills.reset();
      this.ngOnInit();
    })
  }
}