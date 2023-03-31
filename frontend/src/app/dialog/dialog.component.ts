import { Component,Inject,OnInit } from '@angular/core';
import { skillset } from './skillset';
import { SkillsService } from './skills.service';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormBuilder,FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { InnerdialogComponent } from '../innerdialog/innerdialog.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  displayedColumns: string[] = ['emailID','skillGroup','skill','edit','delete'];
  dataSource=new MatTableDataSource<any>();
  data:any;
  deletedata:any;
  emailID!:skillset;
  
  constructor(private skills_service:SkillsService ,public dialogRef:MatDialogRef<DialogComponent>,public dialogRefs:MatDialogRef<InnerdialogComponent>,@Inject(MAT_DIALOG_DATA) public datadialog:any,  private fb: FormBuilder,
  private dialog:MatDialog,private _formBuilder: FormBuilder){
}
ngOnInit(){
  console.log(this.datadialog);
  this.skills_service.getSkill(this.datadialog).subscribe(datas =>{
    console.warn(datas)
    this.data=datas;
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
}
