import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SkillsetService } from './skillset.service';
import { skillsets } from './skillsets';
import { SkilleditService } from './skilledit.service';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.scss']
})
export class DialogboxComponent {
  data: any;
  datas: any;
  skillgroupskill: FormGroup;
  formdatas!: skillsets;
  apiData!: any[];
  apiDataa!: any[];

  constructor(
    private skillssetServices: SkillsetService,
    private skill_edit: SkilleditService,
    private frmbuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dataOfskills: any,
  ) {
    this.skillgroupskill = frmbuilder.group({
      skillSetID: new FormControl(''),
      skillGroupID: new FormControl(''),
    });
  }

  ngOnInit() {
    console.log(this.dataOfskills.element);
    this.skillgroupskill.setValue({
      skillGroupID: this.dataOfskills.element.skillGroupID,
      skillSetID: this.dataOfskills.element.skillSetID,
    });
    console.log(this.dataOfskills.element.skillGroupID);
    console.log(this.dataOfskills.element.skillSetID);
    this.skill_edit.getData().subscribe((data) => {
      console.warn(data);
      this.apiData = data;
    });
    this.skill_edit.getDatas().subscribe((datas) => {
      console.warn(datas);
      this.apiDataa = datas;
    });
  }

  UpdateSkills(resourceSkillID: number, resourceID: number) {
    this.formdatas = {
      ...this.skillgroupskill.value,
      resourceSkillID: resourceSkillID,
      resourceID: resourceID,
    };
    console.warn(this.formdatas);
    this.skillssetServices.UpdateSkills(this.formdatas).subscribe((res) => {
      console.warn(res);
    });
  }
}
