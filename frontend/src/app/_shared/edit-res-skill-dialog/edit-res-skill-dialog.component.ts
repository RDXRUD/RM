import { Component, Inject, OnInit } from '@angular/core';
import { skillset } from '../../_model/skillset';
import { empSkills } from '../../_model/empSkills';
import { SkillsService } from '../../_services/skills.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SkillsetService } from '../../_services/skillset.service';
import { addskillgroupdata } from '../../_model/addskillgroupdata';
import { EditEmpSkillDialogComponent } from '../edit-emp-skill-dialog/edit-emp-skill-dialog.component';

@Component({
  selector: 'app-edit-res-skill-dialog',
  templateUrl: './edit-res-skill-dialog.component.html',
  styleUrls: ['./edit-res-skill-dialog.component.scss']
})
export class EditResSkillDialogComponent implements OnInit {
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
  formdatas!: addskillgroupdata;
  empSkills!:empSkills;
  userdatas: any;

  constructor(private skills_service: SkillsService,
    private skillsetService: SkillsetService,
    public dialogRef: MatDialogRef<EditEmpSkillDialogComponent>,
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
    this.skillsetService.getSkillGroups().subscribe(res => {
      this.DataofSkillGroup = res;
    })
    this.skillsetService.getSkills().subscribe(datas => {
      this.DataofSkill = datas;
    })
  }

  Edit(element: any) {
    const dialogRef = this.dialog.open(EditEmpSkillDialogComponent, {
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

