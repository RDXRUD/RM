import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { UpdateskillsService } from './updateskills.service';
import { SkillgroupService } from './skillgroup.service';
import { update } from './update';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-innerdialog',
  templateUrl: './innerdialog.component.html',
  styleUrls: ['./innerdialog.component.scss']
})
export class InnerdialogComponent {
  apiData!: any[];
  apiDataa!: any[];
  data: any;
  datas: any;
  skills: FormGroup;
  formdata!: update;

  constructor(private update_skills: UpdateskillsService, private skill_group: SkillgroupService, private frmbuilder: FormBuilder, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public dataofskills: any) {
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
    console.log(this.dataofskills.element)
    console.log(this.dataofskills.element.skillGroupID);
    console.log(this.dataofskills.element.skillID);

    this.skill_group.getData().subscribe(data => {
      this.apiData = data;
    })
    this.skill_group.getDatas().subscribe(datas => {
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
    this.update_skills.UpdateSkill(this.formdata).subscribe(result => {
      this.skills.reset();
      this.ngOnInit();
    })
  }
}