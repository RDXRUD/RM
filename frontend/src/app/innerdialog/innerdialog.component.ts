import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,FormBuilder} from '@angular/forms';
import { updateskill } from './updateskill';
import { UpdateskillsService } from './updateskills.service';

@Component({
  selector: 'app-innerdialog',
  templateUrl: './innerdialog.component.html',
  styleUrls: ['./innerdialog.component.scss']
})
export class InnerdialogComponent {
  skills:FormGroup;
  formdata!:updateskill;
  userdata:any;
  constructor(private update_skills:UpdateskillsService,private frmbuilder:FormBuilder){
    this.skills=frmbuilder.group({
      skillGroup:new FormControl(),
      skill:new FormControl(),
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
