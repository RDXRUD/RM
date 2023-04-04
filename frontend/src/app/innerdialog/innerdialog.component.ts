import { Component,Inject } from '@angular/core';
import {FormGroup,FormControl,FormBuilder} from '@angular/forms';
import { UpdateskillsService } from './updateskills.service';
import { SkillgroupService } from './skillgroup.service';
import { update } from './update';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

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
  constructor(private update_skills:UpdateskillsService,private skill_group:SkillgroupService,private frmbuilder:FormBuilder,@Inject(MAT_DIALOG_DATA) private dataofskills:any){
    this.skills=frmbuilder.group({
    skillGroup:new FormControl(''),
    skill:new FormControl(''),
   })
  }
  ngOnInit(){
    console.log(this.dataofskills);
    this.skillGroup.setValue(this.dataofskills.element.skillGroup);
    this.skill.setValue(this.dataofskills.element.skill);
    console.log(this.dataofskills.element.skillGroup);
    console.log(this.dataofskills.element.skill);


    
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
    //  this.formdata=this.skills.value;
    console.warn(this.skills.value);
    this.update_skills.UpdateSkill(this.skills.value).subscribe(userdata=>{
      console.warn(userdata)
    })
   }
}
