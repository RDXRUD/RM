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
  apiData!: any[];
  apiDataa!: any[];
  skillgroupadd: FormGroup;
  addEmpskills: FormGroup;
  formdatas!: addskillgroup;
  empSkills!:empSkills;
  userdatas: any;

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
      skillGroup: new FormControl(),
      skill: new FormControl(),
    })
  }
  ngOnInit() {
    this.skills_service.getSkill(this.datadialog).subscribe(datas => {
      this.data = datas;
    })
    this.add_skill.getData().subscribe(dataa => {
      this.apiData = dataa;
    })
    this.add_skill.getDatas().subscribe(datas => {
      this.apiDataa = datas;
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
    this.empSkills = this.addEmpskills.value;
    this.skills_service.AddEmpSkill(this.empSkills).subscribe((res: any) => {
      this.addEmpskills.reset();
      this.ngOnInit();
    })
  }
}

