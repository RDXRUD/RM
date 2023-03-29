import { Component } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup,FormControl,FormBuilder} from '@angular/forms';
import { SkillsetService } from './skillset.service';
import { skillsets } from './skillsets';


@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.scss']
})
export class DialogboxComponent {
  skill:FormGroup;
  formdata!:skillsets;
  userdata:any;
  constructor(private skillsSet_Services:SkillsetService,private frmbuilder:FormBuilder){
    this.skill=frmbuilder.group({
      skillGroup:new FormControl(),
      skill:new FormControl(),
   })
  }
  UpdateSkills(){
    this.formdata=this.skill.value;
    console.warn(this.formdata);
    this.skillsSet_Services.UpdateSkills(this.formdata).subscribe(userdata=>{
      console.warn(userdata)
    })
   }
}

}
