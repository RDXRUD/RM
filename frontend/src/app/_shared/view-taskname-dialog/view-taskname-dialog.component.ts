import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tasks } from 'src/app/_model/tasks';
@Component({
  selector: 'app-view-taskname-dialog',
  templateUrl: './view-taskname-dialog.component.html',
  styleUrls: ['./view-taskname-dialog.component.scss']
})
export class ViewTasknameDialogComponent {
  displayedColumns: string[] = ['taskName', 'start', 'finish'];
  tasks: tasks[];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.tasks = data.tasks;
  }
}
