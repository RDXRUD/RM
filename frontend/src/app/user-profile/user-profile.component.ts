import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ResetPasswordDailogComponent } from '../_shared/reset-password-dailog/reset-password-dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProfileDialogComponent } from '../_shared/update-profile-dialog/update-profile-dialog.component';
import { ResourcesService } from '../_services/resources.service';
import { resource } from '../_model/resource';
import { SkillsService } from '../_services/skills.service';
import { SkillsetService } from '../_services/skillset.service';
import { SkillGroups } from '../_model/SkillGroups';
import { CoreService } from '../_services/core.service';
import { SkillsofEmp } from '../_model/empSkills';
interface Location {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userID: any;
  userData!: resource[];
  resourceProfile!: FormGroup;
  locations: Location[] = [
    { value: 'IN', viewValue: 'IN' },
    { value: 'US', viewValue: 'US' },
    { value: 'EU', viewValue: 'EU' },
    { value: 'JP', viewValue: 'JP' },
    { value: 'UK', viewValue: 'UK' }
  ];
  displayedColumns: string[] = ['skillGroup', 'skill'];
  resSkillData:any;
  dataofSkillGroup!:any[];
  dataofSkill!:any[];
  empSkills!:SkillsofEmp;
  addEmpskills: FormGroup;
  constructor(
    private skillsetService: SkillsetService,
    private skills_service: SkillsService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private resources_Service: ResourcesService,
    private _coreService:CoreService
  ) {
    this.resourceProfile = this.fb.group({
      res_name: new FormControl(''),
      res_email_id: new FormControl(''),
      res_user_id: new FormControl(''),
      location: new FormControl(''),
      sso_flag: new FormControl(''),
      role_name: new FormControl('')
    });
    this.addEmpskills = this.fb.group({
      skillGroupID: new FormControl(),
      skillID: new FormControl(),
    })
    this.userID = localStorage.getItem("UserID")
  }
  ngOnInit() {
    this.resources_Service.GetResource(this.userID).subscribe(data => {
      this.userData = data;
      this.resourceProfile.setValue({
        res_name: this.userData[0].res_name,
        res_email_id: this.userData[0].res_email_id,
        res_user_id: this.userData[0].res_user_id,
        location: this.userData[0].location,
        sso_flag: this.userData[0].sso_flag,
        role_name: this.userData[0].role_name
      });
      const encodedEmailID = encodeURIComponent(this.userData[0].res_email_id);
    this.skills_service.getSkill(encodedEmailID).subscribe(datas => {
      this.resSkillData = datas;
    })
    })
    // console.log(this.userData);
    
    
    this.skillsetService.getSkillGroups().subscribe(res => {
      this.dataofSkillGroup = res;
    })
  }
  ResetPassword() {
    this.dialog.open(ResetPasswordDailogComponent, {
      width: '350px',
      height: '380px',
    });
  }
  UpdateUser() {
    const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
      width: '480px',
      height: '450px',
      data: { details: this.userData }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'success') {
        this.ngOnInit();
      }
    });
  }
  AddEmpSkill(emailID: string) {
    this.empSkills = {
      ...this.addEmpskills.value,
      emailID: emailID,
    };
    this.skills_service.AddEmpSkill(this.empSkills).subscribe(
      () => {

        this._coreService.openSnackBar('Record Added', 'done')
        this.addEmpskills.reset();
        this.ngOnInit();
      },
      error => {
        if (error.status === 400) {
          this._coreService.openSnackBar('Skill already exists for the resource.', 'ok');
        } else {
          this._coreService.openSnackBar('An error occurred while adding the skill.', 'ok');
        }
      }
    );
  }
  onSkillGroupSelection() {
    const skillGroupID = Number(this.addEmpskills.get('skillGroupID')?.value);
    const skillGroup: SkillGroups = {
      skillGroupID: skillGroupID,
      skillGroup: ''
    };
    this.skillsetService.getSkillAsPerSkillGroup(skillGroup).subscribe(res => {
      this.dataofSkill = res;
    });
  }
}
