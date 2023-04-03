import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,FormBuilder} from '@angular/forms';
import { UpdateskillsService } from './updateskills.service';
import { SkillgroupService } from './skillgroup.service';
import { update } from './update';

@Component({
  selector: 'app-innerdialog',
  templateUrl: './innerdialog.component.html',
  styleUrls: ['./innerdialog.component.scss']
})
export class InnerdialogComponent { 
  skillGroup = new FormControl('');
  skill=new FormControl('');
  apiData!:any[];
  apiDataa!: any[];
  data:any;
  datas:any;
  skills:FormGroup;
  formdata!:update;
  userdata:any;
  constructor(private update_skills:UpdateskillsService,private skill_group:SkillgroupService,private frmbuilder:FormBuilder,private fb: FormBuilder){
    this.skills=frmbuilder.group({
      skillGroup:new FormControl(),
      skill:new FormControl(),
   })
  }
  ngOnInit(){
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
