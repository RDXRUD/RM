import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, NgForm } from '@angular/forms';
import { file } from '../_model/file';
import { EditResSkillDialogComponent } from '../_shared/edit-res-skill-dialog/edit-res-skill-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { userform } from '../_model/userform';
import { addSkill } from '../_model/addSkill';
import { addSkillGroup } from '../_model/addSkillGroup';
import { EditSkillDialogComponent } from '../_shared/edit-skill-dialog/edit-skill-dialog.component';
import { employee } from '../_model/employee';
import { addEmployee } from '../_model/addEmployee';
import { CoreService } from '../_services/core.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SkillsetService } from '../_services/skillset.service';
import { EmployeeService } from '../_services/employee.service';
import { UsersService } from '../_services/users.service';

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
  skillGroups: any;
  res: any;
  deleteuser: any;
  deleteskillgroup: any;
  dc: string[] = ['empID', 'resourceName', 'emailID', 'taskName', 'start', 'finish', 'edit'];
  displayedColumnss: string[] = ['userName', 'fullName', 'delete'];
  displayedColumnsto: string[] = [ 'skillGroup', 'delete'];
  dataOfempSkill!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employee_Service: EmployeeService,
    private frmbuilder: FormBuilder,
    private _coreService: CoreService,
    private dialog: MatDialog, private skillSetService: SkillsetService, private usersService: UsersService
  ) {
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
      skillGroup: new FormControl(),
    })
    this.AddDataOfEmployee = frmbuilder.group({
      resourceName: new FormControl(),
      taskName: new FormControl(),
      start: new FormControl(),
      end: new FormControl()
    })
  }

  ngOnInit() {
    this.employee_Service.getEmployees().subscribe(data => {
      this.data = data
      
    })
    this.employee_Service.getDataOfEmployee().subscribe(datasofemployees => {
      this.dataOfEmployees = datasofemployees
     
    })

    this.skillSetService.getSkillGroups().subscribe(sg => {
      this.apiData = sg;
     
    })
    this.skillSetService.getSkillSets().subscribe(datas => {
      this.datas = datas;
      this.dataOfempSkill = new MatTableDataSource(this.datas);
      this.dataOfempSkill.sort = this.sort;
    })
    this.usersService.getUsers().subscribe(user => {
      this.user = user;
    

    })
    this.skillSetService.getSkillGroups().subscribe(skgroups => {
      this.skillGroups = skgroups;
      
    })
  }

  OnFile() {
    this.formdata = this.forms.value;
    console.warn(this.formdata);
    this.usersService.loadFile(this.formdata).subscribe(datas => {
      this.forms.reset();
    },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this._coreService.openSnackBar("Please choose a file to upload", "ok");
        }
      }
    );
  }

  OnUser() {
    this.formdatas = this.userForm.value;
    this.usersService.addUser(this.formdatas).subscribe(userdata => {
      this.userForm.reset();
      this.ngOnInit();
    })
  }

  AddSkill() {
    this.skilldata = this.addskill.value;
    this.skillSetService.AddSkillset(this.skilldata).subscribe(res => {
      this.addskill.reset();
    })
  }

  AddSkillGroup() {
    this.skillgroupdata = this.addSkillgroup.value;
    this.skillSetService.AddSkillGroup(this.skillgroupdata).subscribe(skillgroupdataApi => {
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

  getResourceSkills(emailID: string) {
    const dialogRef = this.dialog.open(EditResSkillDialogComponent, {
      data: { emailID }
    });
  }

  Edit(element: any) {
    const dialogRef = this.dialog.open(EditSkillDialogComponent, {
      data: { element }
    });
  }

  Delete(skillSetID: number) {
    const confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
      this.skillSetService.DeleteSkillset(skillSetID).subscribe(
        deleteuser => {
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this._coreService.openSnackBar("This field is used in another process, you can't delete it");
          }
        }
      );
    }
  }

  deleteUser(userID: number) {
    const confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
      this.usersService.deleteUser(userID).subscribe(deletedata => {
        this.ngOnInit();
      });
    }
  }

  DeleteSkillGroup(skillGroupID: number) {
    const confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
      this.skillSetService.DeleteSkillGroup(skillGroupID).subscribe(deleteskillgroup => {
        this.ngOnInit();
      });
    }
  }
}
