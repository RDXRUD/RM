import { Component,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-taskname-dialog',
  templateUrl: './view-taskname-dialog.component.html',
  styleUrls: ['./view-taskname-dialog.component.scss']
})
export class ViewTasknameDialogComponent {
  displayedColumns: string[] = ['taskName', 'start', 'finish'];
  tasks:any;
  constructor(
    public dialogRef: MatDialogRef<ViewTasknameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  )
  { this.tasks = data.tasks;
  }
  onClose(): void {
    this.dialogRef.close();
  }
}

