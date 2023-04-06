import { Component,Inject } from '@angular/core';
import {FormGroup,FormControl,FormBuilder,Validators}from '@angular/forms';
import { UpdateskillsService } from './updateskills.service';
import { SkillgroupService } from './skillgroup.service';
import { update } from './update';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { updateskill } from './updateskill';

@Component({
  selector: 'app-innerdialog',
  templateUrl: './innerdialog.component.html',
  styleUrls: ['./innerdialog.component.scss']
})
export class InnerdialogComponent { 

  apiData!:any[];
  apiDataa!: any[];
  data:any;
  datas:any;
  skills:FormGroup;
  formdata!:update;
  userdata:any;
  constructor(private update_skills:UpdateskillsService,private skill_group:SkillgroupService,private frmbuilder:FormBuilder,private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) private dataofskills:any){
    this.skills=frmbuilder.group({
  
    skillGroupID:new FormControl(''),
    id:new FormControl(''),
  
   })
 
}
  ngOnInit(){
    this.skills.setValue({

      id:this.dataofskills.element.id,
      skillGroupID:this.dataofskills.element.skillGroupID,
     
    });
     console.log(this.dataofskills.element)
  
    console.log(this.dataofskills.element.skillGroupID);
    console.log(this.dataofskills.element.id);
    
    this.skill_group.getData().subscribe( data =>{
      console.warn(data)
         this.apiData=data;
    })
    this.skill_group.getDatas().subscribe( datas =>{
      console.warn(datas)
      this.apiDataa=datas;
    })
   }
  UpdateSkill(){
    this.formdata=this.skills.value;
    console.warn(this.formdata);
    this.update_skills.UpdateSkill(this.formdata).subscribe(userdata=>{
      console.warn(userdata)
    })
   }
  }