import { Component,Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup,FormControl,FormBuilder} from '@angular/forms';
import { SkillsetService } from './skillset.service';
import { skillsets } from './skillsets';
import { SkilleditService } from './skilledit.service';

@Component({
  selector: 'app-dialogbox',
  templateUrl: './dialogbox.component.html',
  styleUrls: ['./dialogbox.component.scss']
})
export class DialogboxComponent {
  // skillGroup = new FormControl('');
  // skill=new FormControl('');
  data:any;
  datas:any;
  skillgroupskill:FormGroup;
  formdatas!:skillsets;
  userdatas:any;
  apiData!:any[];
  apiDataa!: any[];
  constructor(private skillssetServices:SkillsetService,private skill_edit:SkilleditService,private frmbuilder:FormBuilder,private fb:FormBuilder,@Inject(MAT_DIALOG_DATA) public dataOfskills:any){
      this.skillgroupskill=frmbuilder.group({
      skillGroup:new FormControl(''),
      skill:new FormControl(''),
   })
  }
  ngOnInit(){
    console.log(this.dataOfskills.element);
    this.skillgroupskill.setValue({
      // skillGroupID:this.dataofskills.element.skillGroupID,
      // id:this.dataofskills.element.id,
      skillGroup: this.dataOfskills.element.skillGroup,
      skill: this.dataOfskills.element.skill,
     
    });
    console.log(this.dataOfskills.element.skillGroup);
    console.log(this.dataOfskills.element.skill);
    this.skill_edit.getData().subscribe( data =>{
      console.warn(data)
         this.apiData=data;
    })
    this.skill_edit.getDatas().subscribe( datas =>{
      console.warn(datas)
      this.apiDataa=datas;
    })
   }
  UpdateSkills(){
    this.formdatas=this.skillgroupskill.value;
    console.warn(this.formdatas);
    this.skillssetServices.UpdateSkills(this.formdatas).subscribe(userdatas=>{
      console.warn(userdatas)
    })
   }
}

