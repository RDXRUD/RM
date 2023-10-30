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
import { SkillGroups } from 'src/app/_model/SkillGroups';
import { CoreService } from 'src/app/_services/core.service';
@Component({
  selector: 'app-edit-res-skill-dialog',
  templateUrl: './edit-res-skill-dialog.component.html',
  styleUrls: ['./edit-res-skill-dialog.component.scss']
})
export class EditResSkillDialogComponent implements OnInit {
  skillGroup = new FormControl('');
  skill = new FormControl('');
  displayedColumns: string[] = ['emailID', 'skillGroup', 'skill', 'edit','delete'];
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
    private _coreService:CoreService
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
    console.log(this.datadialog.emailID)
    const encodedEmailID = encodeURIComponent(this.datadialog.emailID);
    console.log(encodedEmailID)
    this.skills_service.getSkill(encodedEmailID).subscribe(datas => {
      this.data = datas;
    })
    this.skillsetService.getSkillGroups().subscribe(res => {
      this.DataofSkillGroup = res;
    })
  }

  Edit(element: any) {
    const dialogRef = this.dialog.open(EditEmpSkillDialogComponent, {
      data: { element }
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'success') {
        // Refresh the data after a successful update
        this.ngOnInit();
      }
    });
  };
  AddEmpSkill(emailID: string) {
    console.log(emailID)
    this.empSkills = {
      ...this.addEmpskills.value,
      emailID: emailID,
    };
    console.warn(this.empSkills);
    this.skills_service.AddEmpSkill(this.empSkills).subscribe(
      res => {
        console.log(this.empSkills)
        this._coreService.openSnackBar('Record Added', 'done')
        this.addEmpskills.reset();
        this.ngOnInit();
      },
      error => {
        console.error(error);
        if (error.status === 400) {
          this._coreService.openSnackBar('Skill already exists for the resource.', 'ok');
        } else {
          this._coreService.openSnackBar('An error occurred while adding the skill.', 'ok');
        }
      }
    );
  }
  Delete(element:any)
  {
    const confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
      this.skills_service.DeleteResourceSkill(element.resourceSkillID).subscribe((deletedata: any) => {
        this._coreService.openSnackBar(" Record deleted", "ok")
        this.ngOnInit();
      });
    }
  }

  onSkillGroupSelection() {
    const skillGroupID = Number(this.addEmpskills.get('skillGroupID')?.value);
    const skillGroup: SkillGroups = {
      skillGroupID: skillGroupID,
      skillGroup: ''
    };
    this.skillsetService.getSkillAsPerSkillGroup(skillGroup).subscribe(res => {
      this.DataofSkill = res;
    });
  }
}