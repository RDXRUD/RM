import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from 'src/app/_model/client';
import { ClientService } from 'src/app/_services/client.service';
import { CoreService } from 'src/app/_services/core.service';
import { ProjectService } from 'src/app/_services/project.service';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.scss']
})

export class AddProjectDialogComponent {
  [x: string]: any;
  addProject: FormGroup;
  projectStatus!: any[];
  projectType!: any[];
  formdata!: Client;


  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  project_manager = new FormControl();
  resourceExtensionData!: any[];
  filteredResOptions!: any;
  resexpansionid: any;
  dataofProj!: any[];
  temp: any;
  clientData:any;

  constructor(private projectService: ProjectService,
    private clientService: ClientService ,
    private _coreService: CoreService, 
    private fb: FormBuilder,
    //public dialogRef: MatDialogRef<AddProjectDialogComponent>,
    //@Inject(MAT_DIALOG_DATA) public dataOfClient: any,
  ) {
    this.addProject = this.fb.group({
      client_id: new FormControl(),
      project_name: new FormControl(),
      project_manager: new FormControl,
      start_date: new FormControl(),
      end_date: new FormControl(),
      project_type: new FormControl(),
      project_status: new FormControl()
    })
      // this.dataofProj = dataOfClient;
  }
  ngOnInit() {
    this.clientService.getActiveClients().subscribe(data => {
      this.clientData = data;
    })
    this.projectService.getProjectMangers().subscribe(data => {
      this.resourceExtensionData = data;
    })
    this.projectService.getProjectStatus().subscribe(data =>
      this.projectStatus = data
    )
    this.projectService.getProjectType().subscribe(data =>
      this.projectType = data
    )
  }

  AddProject() {
    this.temp = this.addProject.value;
    this.temp.project_manager = this.resexpansionid
    this.projectService.AddProject(this.temp).subscribe(data => {
      this._coreService.openSnackBar('Project Added Successfully ', 'done');
      this.addProject.reset();
      // this.dialogRef.close('success');
      this.ngOnInit();
    },(error: HttpErrorResponse) => {
      if (error.status == 502) {
        this._coreService.openSnackBar('Project Name already exist', 'Ok');
      }
    })
  }
  filterRes(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredResOptions = this.resourceExtensionData.filter(o => o.res_name.toLowerCase().includes(filterValue));
    this.resexpansionid = this.filteredResOptions.length == 1 ? this.filteredResOptions[0].res_id : 'undefined'
  }
  windowClose(){
    window.close();
  }
}
