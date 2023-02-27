import { Component,OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';
import {FormGroup,FormControl,FormBuilder,NgForm} from '@angular/forms';
import { file } from './file';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  forms:FormGroup;
  formdata!:file;
  
  displayedColumns: string[] = ['empID', 'resourceName','emailID','details'];
   data:any;
   datas:any;
   displayedColumnss: string[]= ['id','skillGroup','skill','edit','delete'];
   constructor(private employee_Service:EmployeeService,private frmbuilder:FormBuilder){
    this.forms=frmbuilder.group({
      UserName:new FormControl(),
      file:new FormControl(),
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
  }
  OnFile(){
    this.formdata=this.forms.value;
    console.warn(this.formdata);
    this.employee_Service.OnFile(this.formdata).subscribe(datas=>{
      console.warn(datas)
      // this.data=datas
    })
   }
   
 getSkills(){
    alert()
  }
  Edit(){
    alert()
  }
  Delete(){
    alert()
  }
}
