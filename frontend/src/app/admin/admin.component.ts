import { Component,OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import {FormGroup,FormControl,FormBuilder} from '@angular/forms';
import { file } from './file';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogboxComponent } from '../dialogbox/dialogbox.component';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { userform } from './userform';
import { addskills } from './addskills';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  forms:FormGroup;
  formdata!:file;
  userForm:FormGroup;
  formdatas!:userform;
  addskill:FormGroup;
  skilldata!:addskills;
  deletedata:any;
  data:any;
  displayedColumns: string[] = ['empID', 'resourceName','emailID','details'];
   datas:any;
  dsp: string[]= ['id','skillGroup','skill','edit','delete'];
   user:any;
   userdata:any;
   deleteuser:any;
   displayedColumnss: string[]= ['userName','fullName','delete'];

   constructor(private employee_Service:EmployeeService,private frmbuilder:FormBuilder,private dialog:MatDialog){
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
  }
  ngOnInit(){
    this.employee_Service.getData().subscribe( data =>{
      console.warn(data)
         this.data=data
    })
    this.employee_Service.getDetails().subscribe( datas =>{
      console.warn(datas)
      this.datas=datas
    })
    this.employee_Service.getUsers().subscribe(user =>{
      console.warn(user)
      this.user=user
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
 getSkills(emailID:string){
  // console.warn(emailID);
  const dialogRef= this.dialog.open(DialogComponent,{
      data:{emailID}
    });
  }
  Edit(id:number){
    const dialogRef=this.dialog.open(DialogboxComponent,{
      data:{id}
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
}
