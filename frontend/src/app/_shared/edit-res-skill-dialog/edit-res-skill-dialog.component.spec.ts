import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResSkillDialogComponent } from './edit-res-skill-dialog.component';

describe('DialogComponent', () => {
  let component: EditResSkillDialogComponent;
  let fixture: ComponentFixture<EditResSkillDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditResSkillDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditResSkillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
