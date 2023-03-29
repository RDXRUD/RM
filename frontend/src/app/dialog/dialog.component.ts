import { Component,Inject,OnInit,ViewChild } from '@angular/core';
import { skillset } from './skillset';
import { SkillsService } from './skills.service';
import { MatDialog,MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormBuilder,FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { InnerdialogComponent } from '../innerdialog/innerdialog.component';
import { updateskill } from '../innerdialog/updateskill';

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
  // isLoading=true;
  // VOForm!:FormGroup;
  // isEditableNew:boolean=true;
  constructor(private skills_service:SkillsService ,public dialogRef:MatDialogRef<DialogComponent>,public dialogRefs:MatDialogRef<InnerdialogComponent>,@Inject(MAT_DIALOG_DATA) public datadialog:any,  private fb: FormBuilder,
  private dialog:MatDialog,private _formBuilder: FormBuilder){
}
ngOnInit(){
  console.log(this.datadialog);
  this.skills_service.getSkill(this.datadialog).subscribe(datas =>{
    console.warn(datas)
    this.data=datas;
  })
  // this.VOForm=this._formBuilder.group({
  //   VORows:this._formBuilder.array([])
  // });
  //  this.VOForm=this.fb.group({
  //    VORows:this.fb.array(skillset.map(val => this.fb.group({
  //     emailID:new FormControl(val.emailID),
  //     skillGroup:new FormControl(val.skillGroup),
  //     skill:new FormControl(val.skill),
  //     action: new FormControl('existingRecord'),
  //     isEditable: new FormControl(true),
  //     // isNewRow: new FormControl(false),
  //   })
  //   ))
  //  });
  //  this.isLoading=false;
  //  this.dataSource=new MatTableDataSource((this.VOForm.get('VORows') as FormArray).controls);
  //  this.VORows=this._formBuilder.array([])
  
}
// EditSVO(VOForm,i) {

//   VOForm.get('VORows').at(i).get('isEditable').patchValue(false);

// }

// SaveVO(VOForm, i) {
//   VOForm.get('VORows').at(i).get('isEditable').patchValue(true);
// }

// CancelSVO(VOForm, i) {
//   VOForm.get('VORows').at(i).get('isEditable').patchValue(true);
// }
// initiateVOForm(): FormGroup {
//   return this.fb.group({

//               emailID: new FormControl(''),
//               skillGroup: new FormControl(''),
//               skill: new FormControl(''),
//               action: new FormControl('newRecord'),
//               isEditable: new FormControl(false),
//               isNewRow: new FormControl(true),
//   });
// }
Edit(resourceID:number) 
{ const dialogRefs=this.dialog.open(InnerdialogComponent,{
  data:{resourceID}
});
};

Delete(resourceID:number){
  console.warn(resourceID);
  this.skills_service.Delete(resourceID).subscribe(deletedata=>{
    console.warn(deletedata);
  })
};
}
