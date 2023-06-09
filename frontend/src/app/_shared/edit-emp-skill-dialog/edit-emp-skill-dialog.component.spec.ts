import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmpSkillDialogComponent } from './edit-emp-skill-dialog.component';

describe('DialogboxComponent', () => {
  let component: EditEmpSkillDialogComponent;
  let fixture: ComponentFixture<EditEmpSkillDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEmpSkillDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEmpSkillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
