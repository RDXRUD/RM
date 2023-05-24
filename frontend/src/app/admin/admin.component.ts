import { Component, OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { file } from './file';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { userform } from './userform';
import { addSkill } from './addSkill';
import { addSkillGroup } from './addSkillGroup';
import { SkillgroupService } from '../innerdialog/skillgroup.service';
import { InnerdialogComponent } from '../innerdialog/innerdialog.component';
import { EmployeeUpdateDialogComponent } from '../employee-update-dialog/employee-update-dialog.component';
import { employee } from './employee';
import { addEmployee } from './addEmployee';

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
      userName: new FormControl(),
      planFile: new FormControl(),
    })
    this.userForm = frmbuilder.group({
      userName: new FormControl(),
      fullName: new FormControl(),
      password: new FormControl(),
    })
    this.addskill = frmbuilder.group({
      skillID: new FormControl(),
      skillGroupID: new FormControl(),
      skill: new FormControl(),
    })
    this.addSkillgroup = frmbuilder.group({
      skillGroupID: new FormControl(),
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
      console.warn(data)
      this.data = data
    })
    this.employee_Service.getDataOfEmployee().subscribe(datasofemployees => {
      console.warn(datasofemployees)
      this.dataOfEmployees = datasofemployees
    })

    this.skillgroup.getData().subscribe(sg => {
      console.warn(sg)
      this.apiData = sg;
    })
    this.employee_Service.getDetails().subscribe(datas => {
      console.warn(datas)
      this.datas = datas
    })
    this.employee_Service.getUsers().subscribe(user => {
      console.warn(user)
      this.user = user
    })
    this.employee_Service.getSkillGroup().subscribe(users => {
      console.warn(users)
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
    console.warn(this.formdatas);
    this.employee_Service.OnUser(this.formdatas).subscribe(userdata => {
      console.warn(userdata)


    })
  }
  AddSkill() {
    this.skilldata = this.addskill.value;
    console.warn(this.skilldata);
    this.employee_Service.AddSkill(this.skilldata).subscribe(res => {
      console.warn(res)


    })
  }
  AddSkillGroup() {
    this.skillgroupdata = this.addSkillgroup.value;
    console.warn(this.skillgroupdata);
    this.employee_Service.AddSkillGroup(this.skillgroupdata).subscribe(skillgroupdata => {
      console.warn(skillgroupdata)


    })
  }
  AddEmpDetails() {
    this.addEmpDetails = this.AddDataOfEmployee.value;
    console.warn(this.addEmpDetails);
    this.employee_Service.AddEmpDetails(this.addEmpDetails).subscribe(addEmpDetails => {
      console.warn(addEmpDetails)
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
  EditData(dataOfEmployee: any) {
    const dialogRef = this.dialog.open(EmployeeUpdateDialogComponent, {
      data: { dataOfEmployee }
    });
  }
  Delete(skillSetID: number) {
    this.employee_Service.Delete(skillSetID).subscribe(deleteuser => {
      console.warn(deleteuser)


    })
  }
  deleteUser(userID: number) {
    console.warn(userID);
    this.employee_Service.deleteUser(userID).subscribe(deletedata => {
      console.warn(deletedata);

    })
  };
  DeleteSkillGroup(skillGroupID: number) {
    console.warn(skillGroupID);
    this.employee_Service.DeleteSkillGroup(skillGroupID).subscribe(deleteskillgroup => {
      console.warn(deleteskillgroup);

    })
  }

}
