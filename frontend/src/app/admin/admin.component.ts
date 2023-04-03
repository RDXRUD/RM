import { Component,OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import {FormGroup,FormControl,FormBuilder} from '@angular/forms';
import { file } from './file';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { userform } from './userform';
import { addskills } from './addskills';
import { addskillgroups } from './addskillgroups';
import { SGService } from './sg.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  skillGroup = new FormControl('');
  apiData!:any[];
  forms:FormGroup;
  formdata!:file;
  userForm:FormGroup;
  formdatas!:userform;
  addskill:FormGroup;
  addskillgroup:FormGroup;
  skilldata!:addskills;
  skillgroupdata!:addskillgroups;
  deletedata:any;
  data:any;
  sg:any;
  displayedColumns: string[] = ['empID', 'resourceName','emailID','details'];
   datas:any;
  dsp: string[]= ['id','skillGroup','skill','edit','delete'];
   user:any;
   userdata:any;
   users:any;
   deleteuser:any;
   deleteskillgroup:any;

   displayedColumnss: string[]= ['userName','fullName','delete'];
   displayedColumnsto:string[]=['skillGroupID','skillGroup','delete'];
   
   constructor(private employee_Service:EmployeeService,private skillgroup:SGService,private frmbuilder:FormBuilder,private dialog:MatDialog){
    this.forms=frmbuilder.group({
      userName:new FormControl(),
      planFile:new FormControl(),
   })
    this.userForm=frmbuilder.group({
      // userID:new FormControl(),
      userName:new FormControl(),
      fullName:new FormControl(),
      password:new FormControl(),
    })
    this.addskill=frmbuilder.group({
      id:new FormControl(),
      skillGroup:new FormControl(),
      skill:new FormControl(),
    })
    this.addskillgroup=frmbuilder.group({
      skillGroupID:new FormControl(),
      skillGroup:new FormControl,
    })
  }
  ngOnInit(){
    this.employee_Service.getData().subscribe( data =>{
      console.warn(data)
         this.data=data
    })
    this.skillgroup.getData().subscribe(sg =>{
      console.warn(sg)
         this.apiData=sg;
    })
    this.employee_Service.getDetails().subscribe( datas =>{
      console.warn(datas)
      this.datas=datas
    })
    this.employee_Service.getUsers().subscribe(user =>{
      console.warn(user)
      this.user=user
    })
    this.employee_Service.getSkillGroup().subscribe(users =>{
      console.warn(users)
      this.users=users;
    })
  }
  OnFile(){
    this.formdata=this.forms.value;
    console.warn(this.formdata);
    this.employee_Service.OnFile(this.formdata).subscribe(datas=>{
      console.warn(datas)
      alert("File Loaded Successfully")
      // this.data=datas
    })
   }
   OnUser(){
    this.formdatas=this.userForm.value;
    console.warn(this.formdatas);
    this.employee_Service.OnUser(this.formdatas).subscribe(userdata=>{
      console.warn(userdata)
    })
   }
   AddSkill(){
    this.skilldata=this.addskill.value;
    console.warn(this.skilldata);
    this.employee_Service.AddSkill(this.skilldata).subscribe(skilldata=>{
      console.warn(skilldata)
    })
   }
   AddSkillGroup(){
    this.skillgroupdata=this.addskillgroup.value;
    console.warn(this.skillgroupdata);
    this.employee_Service.AddSkillGroup(this.skillgroupdata).subscribe(skillgroupdata=>{
      console.warn(skillgroupdata)
    })
   }
 getSkills(emailID:string){
  // console.warn(emailID);
  const dialogRef= this.dialog.open(DialogComponent,{
      data:{emailID}
    });
  }
  Edit(element:any){
    const dialogRef=this.dialog.open(DialogboxComponent,{
      data:{element}
    });
    }
  Delete(id:number){
    console.warn(id);
    this.employee_Service.Delete(id).subscribe(deleteuser=>{
      console.warn(deleteuser)
    })
  }
  del(userID:number){
    console.warn(userID);
    this.employee_Service.del(userID).subscribe(deletedata=>{
      console.warn(deletedata);
    })
  };
  DeleteSkillGroup(skillGroupID:number){
    console.warn(skillGroupID);
    this.employee_Service.DeleteSkillGroup(skillGroupID).subscribe(deleteskillgroup=>{
      console.warn(deleteskillgroup);
    })
  }
}
