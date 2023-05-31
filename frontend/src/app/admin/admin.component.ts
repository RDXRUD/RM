import { Component, OnInit} from '@angular/core';
import { EmployeeService } from './employee.service';
import { FormGroup, FormControl, FormBuilder, NgForm } from '@angular/forms';
import { file } from './file';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { userform } from './userform';
import { addSkill } from './addSkill';
import { addSkillGroup } from './addSkillGroup';
import { SkillgroupService } from '../innerdialog/skillgroup.service';
import { InnerdialogComponent } from '../innerdialog/innerdialog.component';
import { employee } from './employee';
import { addEmployee } from './addEmployee';
import { CoreService } from '../core/core.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
   apiData!: any[];
  dataOfEmployees!: employee[];
  forms: FormGroup;
  formdata!: file;
  userForm: FormGroup;
  formdatas!: userform;
  addskill: FormGroup;
  addSkillgroup: FormGroup;
  AddDataOfEmployee: FormGroup;
  skilldata!: addSkill;
  skillgroupdata!: addSkillGroup;
  addEmpDetails!: addEmployee;
  deletedata: any;
  data: any;
  sg: any;
  datasofemployees: any;
  displayedColumns: string[] = ['empID', 'resourceName', 'emailID', 'details'];
  datas: any;
  dsp: string[] = ['skillSetID', 'skillGroup', 'skill', 'edit', 'delete'];
  user: any;
  userdata: any;
  users: any;
  res: any;
  deleteuser: any;
  deleteskillgroup: any;
  dc: string[] = ['empID', 'resourceName', 'emailID', 'taskName', 'start', 'finish', 'edit'];
  displayedColumnss: string[] = ['userName', 'fullName', 'delete'];
  displayedColumnsto: string[] = ['skillGroupID', 'skillGroup', 'delete'];

  constructor(private employee_Service: EmployeeService,
    private skillgroup: SkillgroupService,
    private frmbuilder: FormBuilder,
    private dialog: MatDialog) {
    this.forms = frmbuilder.group({
      planFile: new FormControl(),
    })
    this.userForm = frmbuilder.group({
      userName: new FormControl(),
      fullName: new FormControl(),
      password: new FormControl(),
    })
    this.addskill = frmbuilder.group({
      skillGroupID: new FormControl(),
      skill: new FormControl(),
    })
    this.addSkillgroup = frmbuilder.group({
      skillGroup: new FormControl,
    })
    this.AddDataOfEmployee = frmbuilder.group({
      resourceName: new FormControl(),
      taskName: new FormControl(),
      start: new FormControl(),
      end: new FormControl()
    })
  }
  ngOnInit() {
    this.employee_Service.getData().subscribe(data => {
      this.data = data
    })
    this.employee_Service.getDataOfEmployee().subscribe(datasofemployees => {
      this.dataOfEmployees = datasofemployees
    })

    this.skillgroup.getData().subscribe(sg => {
      this.apiData = sg;
    })
    this.employee_Service.getDetails().subscribe(datas => {
      this.datas = datas
    })
    this.employee_Service.getUsers().subscribe(user => {
      this.user = user
    })
    this.employee_Service.getSkillGroup().subscribe(users => {
      this.users = users;
    })

  }

  OnFile() {
    this.formdata = this.forms.value;
    console.warn(this.formdata);
    this.employee_Service.OnFile(this.formdata).subscribe(datas => {
      console.warn(datas)
    })
  }
  OnUser() {
    this.formdatas = this.userForm.value;
    this.employee_Service.OnUser(this.formdatas).subscribe(userdata => {
      this.userForm.reset();
      this.ngOnInit();
    })
  }
  AddSkill() {
    this.skilldata = this.addskill.value;
    this.employee_Service.AddSkill(this.skilldata).subscribe(res => {
      this.addskill.reset();
    })
  }
  AddSkillGroup() {
    this.skillgroupdata = this.addSkillgroup.value;
    this.employee_Service.AddSkillGroup(this.skillgroupdata).subscribe(skillgroupdataApi => {
      this.addSkillgroup.reset();
      this.ngOnInit();

    })
  }
  AddEmpDetails() {
    this.addEmpDetails = this.AddDataOfEmployee.value;
    this.employee_Service.AddEmpDetails(this.addEmpDetails).subscribe(addEmpDetails => {
      this.AddDataOfEmployee.reset();
      this.ngOnInit();
    })
  }
  getSkills(emailID: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { emailID }
    });
  }
  Edit(element: any) {
    const dialogRef = this.dialog.open(InnerdialogComponent, {
      data: { element }
    });
  }

  Delete(skillSetID: number) {
    const confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
      this.employee_Service.Delete(skillSetID).subscribe(deleteuser => {
        this.ngOnInit();
      });
    }
  }
  deleteUser(userID: number) {
    const confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
    this.employee_Service.deleteUser(userID).subscribe(deletedata => {
      this.ngOnInit();

    })}
  };
  DeleteSkillGroup(skillGroupID: number) {
    const confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
    this.employee_Service.DeleteSkillGroup(skillGroupID).subscribe(deleteskillgroup => {
      this.ngOnInit();

    });
  }

  }
}
