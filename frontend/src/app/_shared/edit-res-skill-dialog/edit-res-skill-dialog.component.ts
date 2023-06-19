import { Component, Inject, OnInit } from '@angular/core';
import { skillset } from '../../_model/skillset';
import { SkillsofEmp } from '../../_model/empSkills';
import { SkillsService } from '../../_services/skills.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SkillsetService } from '../../_services/skillset.service';
import { addskillgroupdata } from '../../_model/addskillgroupdata';
import { EditEmpSkillDialogComponent } from '../edit-emp-skill-dialog/edit-emp-skill-dialog.component';
import { skill } from 'src/app/_model/skill';
import { SkillGroups } from 'src/app/_model/SkillGroups';


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
  res!:SkillsofEmp;
  emailID!: skillset;
  DataofSkillGroup!: any[];
  DataofSkill!: any[];
  skillgroupadd: FormGroup;
  addEmpskills: FormGroup;
  formdatas!: addskillgroupdata;
  empSkills!:SkillsofEmp;
  userdatas: any;
  skillDataSorted:any[] | undefined;


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
    // this.skillsetService.getSkills().subscribe(datas => {
    //   this.DataofSkill = datas;
    //   this.skillDataSorted = this.DataofSkill.sort((a, b) => a.skill.localeCompare(b.skill));
    // })
  }

  Edit(element: any) {
    const dialogRef = this.dialog.open(EditEmpSkillDialogComponent, {
      data: { element }
    });
  };
  
  // AddSkills() {
  //   this.formdatas = this.skillgroupadd.value;
  //   this.skills_service.AddSkills(this.formdatas).subscribe(userdatas => {
  //     this.skillgroupadd.reset();
  //     this.ngOnInit();

  //   })
  // }
  AddEmpSkill(emailID: string) {
    this.empSkills = {
      ...this.addEmpskills.value,
      emailID: emailID,
    };
    console.warn(this.empSkills);
    this.skills_service.AddEmpSkill(this.empSkills).subscribe(res => {
      console.log(res);
      this.addEmpskills.reset();
      this.ngOnInit();
    });
  }
  // AddEmpSkill(emailID: string) {
  //   const request: empSkills = {
  //     EmailID: emailID,
  //     SkillID: this.addEmpskills.value.skillID,
  //     SkillGroupID: this.addEmpskills.value.skillGroupID
  //   };
  
  //   this.skills_service.AddEmpSkill(request).subscribe(res => {
  //     console.log(res);
  //     this.addEmpskills.reset();
  //     this.ngOnInit();
  //   });
  // }
  
  onSkillGroupSelection() {
    
    const skillGroupID = Number(this.addEmpskills.get('skillGroupID')?.value);
    const skillGroup: SkillGroups = {
      skillGroupID: skillGroupID,
      skillGroup: ''
    };
    this.skillsetService.getSkillAsPerSkillGroup(skillGroup).subscribe(res => {
      console.log(res);
      this.DataofSkill = res;
    });
  }
  // AddEmpSkill(){}
}

