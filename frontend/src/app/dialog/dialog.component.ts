import { Component,Inject,OnInit } from '@angular/core';
import { skillset } from './skillset';
import { SkillsService } from './skills.service';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormBuilder,FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { InnerdialogComponent } from '../innerdialog/innerdialog.component';
import { AddskillService } from './addskill.service';
import { addskillgroup } from './addskillgroup';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  skillGroup = new FormControl('');
  skill=new FormControl('');
  displayedColumns: string[] = ['emailID','skillGroup','skill','edit','delete'];
  dataSource=new MatTableDataSource<any>();
  data:any;
  dataa:any;
  datas:any;
  deletedata:any;
  emailID!:skillset;
  apiData!:any[];
  apiDataa!: any[];
  skillgroupadd:FormGroup;
  formdatas!:addskillgroup;
  userdatas:any;
  
  constructor(private skills_service:SkillsService ,private add_skill:AddskillService,public dialogRef:MatDialogRef<DialogComponent>,public dialogRefs:MatDialogRef<InnerdialogComponent>,@Inject(MAT_DIALOG_DATA) public datadialog:any,  private fb: FormBuilder,
  private dialog:MatDialog,private _formBuilder: FormBuilder){
    this.skillgroupadd=_formBuilder.group({
      skillGroup:new FormControl(),
      skill:new FormControl(),
    })
  }
ngOnInit(){
  console.log(this.datadialog);
  this.skills_service.getSkill(this.datadialog).subscribe(datas =>{
    console.warn(datas)
    this.data=datas;
  })
  this.add_skill.getData().subscribe( dataa =>{
    console.warn(dataa)
       this.apiData=dataa;
  })
  this.add_skill.getDatas().subscribe( datas =>{
    console.warn(datas)
    this.apiDataa=datas;
  })
}

Edit(resourceID:number) 
{ const dialogRefs=this.dialog.open(InnerdialogComponent,{
  data:{resourceID}
});
console.warn(resourceID);
};

Delete(resourceID:number){
  console.warn(resourceID);
  this.skills_service.Delete(resourceID).subscribe(deletedata=>{
    console.warn(deletedata);
  })
};
AddSkills(){
  this.formdatas=this.skillgroupadd.value;
  console.warn(this.formdatas);
  this.skills_service.AddSkills(this.formdatas).subscribe(userdatas=>{
    console.warn(userdatas)
  })
 }
}

