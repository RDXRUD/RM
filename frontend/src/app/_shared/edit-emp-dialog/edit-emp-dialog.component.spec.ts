import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmpDialogComponent } from './edit-emp-dialog.component';

describe('EditEmpDialogComponent', () => {
  let component: EditEmpDialogComponent;
  let fixture: ComponentFixture<EditEmpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmpDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
