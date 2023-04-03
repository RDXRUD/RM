import { Component,OnInit } from '@angular/core';
import { UsersService } from './users.service';
import {FormGroup,FormControl,FormBuilder} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;
import { employeefilters } from './employeefilters';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM DD YYYY',
  },
  display: {
    dateInput: ' DD-MMM-YYYY',
    monthYearLabel: ' MMM',
    dateA11yLabel: 'LL',
   monthYearA11yLabel: 'MMM LL YYYY',
  },
};
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
   signupForm:FormGroup;
  //  empID:string="";
  //  resourceName:string="";
  //  emailID:string="";
  //  taskName:string="";
  //  start:string="";
  //  finish:string="";
  // name:string="";
  //     emailID:string="";
  //     taskName:string="";
  //     skill:string="";
  //     assignedFrom:string="";
  //     assignedTo:string="";
  //     availableFrom:string="";
  //     availableTo:string="";
   displayedColumns: string[] = ['empID', 'resourceName', 'emailID','taskName','start','finish'];
      data:any;
      datas:any;
      formdata!:employeefilters;
   constructor(private users_Service:UsersService,private frmbuilder:FormBuilder ){
    this.signupForm=frmbuilder.group({
      // empID:new FormControl(),
      name:new FormControl(),
      emailID:new FormControl(),
      taskName:new FormControl(),
      skill:new FormControl(),
      assignedFrom:new FormControl(),
      assignedTo:new FormControl(),
      availableFrom:new FormControl(),
      availableTo:new FormControl(),
   })
  }
   ngOnInit(){
    this.users_Service.getData().subscribe( data =>{
      console.warn(data)
         this.data=data
    })
   }
   OnSubmit(){
    this.formdata=this.signupForm.value;
    console.warn(this.formdata);
    this.users_Service.OnSubmit(this.formdata).subscribe(datas=>{
      console.warn(datas)
      this.data=datas
    })
   }
   resetForm(){
    this.signupForm.reset();
   }
  }