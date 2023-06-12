import { Component, Inject, OnInit } from '@angular/core';
import { skillset } from './skillset';
import { empSkills } from './empSkills';
import { SkillsService } from './skills.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AddskillService } from './addskill.service';
import { addskillgroup } from './addskillgroup';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  skillGroup = new FormControl('');
  skill = new FormControl('');
  displayedColumns: string[] = ['emailID', 'skillGroup', 'skill', 'edit',];
  dataSource = new MatTableDataSource<any>();
  data: any;
  dataa: any;
  datas: any;
  deletedata: any;
  emailID!: skillset;
  DataofSkillGroup!: any[];
  DataofSkill!: any[];
  skillgroupadd: FormGroup;
  addEmpskills: FormGroup;
  formdatas!: addskillgroup;
  empSkills!:empSkills;
  userdatas: any;
  skillDataSorted:any[] | undefined;

  constructor(private skills_service: SkillsService,
    private add_skill: AddskillService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public datadialog: any,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
  ) {
    this.skillgroupadd = _formBuilder.group({
      skillGroup: new FormControl(),
      skill: new FormControl(),
    })
    this.addEmpskills = _formBuilder.group({
      skillGroupID: new FormControl(),
      skillID: new FormControl(),
    })
  }
  ngOnInit() {
    this.skills_service.getSkill(this.datadialog).subscribe(datas => {
      this.data = datas;
    })
    this.add_skill.getData().subscribe(res => {
      this.DataofSkillGroup = res;
    })
    this.add_skill.getDatas().subscribe(datas => {
      this.DataofSkill = datas;
      this.skillDataSorted = this.DataofSkill.sort((a, b) => a.skill.localeCompare(b.skill));
    })
  }

  Edit(element: any) {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      data: { element }
    });
  };


  AddSkills() {
    this.formdatas = this.skillgroupadd.value;
    this.skills_service.AddSkills(this.formdatas).subscribe(userdatas => {
      this.skillgroupadd.reset();
      this.ngOnInit();

    })
  }
  AddEmpSkill() {
    this.empSkills = {
      ...this.addEmpskills.value,
    };
    console.warn(this.empSkills);
    this.skills_service.AddEmpSkill(this.empSkills).subscribe((res: any) => {
      this.addEmpskills.reset();
      this.ngOnInit();
    })
  }
}

