import { Component,OnInit } from '@angular/core';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  displayedColumns: string[] = ['empID', 'resourceName','emailID','details'];
   data:any;
   datas:any;
   displayedColumnss: string[]= ['id','skillGroup','skill'];
   constructor(private employee_Service:EmployeeService){}
  ngOnInit(){
    this.employee_Service.getData().subscribe( data =>{
      console.warn(data)
         this.data=data
    })}
    getRecord(){
    this.employee_Service.getDetails().subscribe( datas =>{
      console.warn(datas)
      this.datas=datas
    })
  }
   
  //  getRecord(name:any){
  //   alert(name);
  //  }
  }
