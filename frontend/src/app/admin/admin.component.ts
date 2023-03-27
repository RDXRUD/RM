import { Component,OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import {FormGroup,FormControl,FormBuilder} from '@angular/forms';
import { file } from './file';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  forms:FormGroup;
  formdata!:file;
  data:any;
  displayedColumns: string[] = ['empID', 'resourceName','emailID','details'];
   
  //  user:any;

   datas:any;
  //  displayedColumnss: string[]= ['id','skillGroup','skill','edit','delete'];
  dsp: string[]= ['id','skillGroup','skill','edit','delete'];
   user:any;
   displayedColumnss: string[]= ['userID','userName','fullName','password'];

   constructor(private employee_Service:EmployeeService,private frmbuilder:FormBuilder,private dialog:MatDialog){
    this.forms=frmbuilder.group({
      userName:new FormControl(),
      planFile:new FormControl(),
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
   
 getSkills(emailID:string){
  // console.warn(emailID);
  const dialogRef= this.dialog.open(DialogComponent,{
      data:{emailID}
    });
  }
  Edit(){
    alert()
  }
  Delete(){
    alert()
  }
}
