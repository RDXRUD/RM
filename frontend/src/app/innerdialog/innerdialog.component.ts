import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,FormBuilder} from '@angular/forms';
import { updateskill } from './updateskill';
import { UpdateskillsService } from './updateskills.service';
import { SkillgroupService } from './skillgroup.service';
import { update } from './update';

@Component({
  selector: 'app-innerdialog',
  templateUrl: './innerdialog.component.html',
  styleUrls: ['./innerdialog.component.scss']
})
export class InnerdialogComponent {
  // selectedRow: any = null; 
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
    // this.skillGroup = new FormControl(this.selectedRow?.skillGroup || '');
    // this.skill = new FormControl(this.selectedRow?.skill || '');
    // // Set the default value of the skillGroup control based on the selected row
    // this.skillGroup.setValue(this.selectedRow?.skillGroup || '');
    // // Create the form group
    // this.skills = this.fb.group({
    //   skillGroup: this.skillGroup,
    //   skill: this.skill
    // });
   }
  
  UpdateSkill(){
    this.formdata=this.skills.value;
    console.warn(this.formdata);
    this.update_skills.UpdateSkill(this.formdata).subscribe(userdata=>{
      console.warn(userdata)
    })
   }
}
