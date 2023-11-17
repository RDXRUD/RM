import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillGroupDialogComponent } from './edit-skill-group-dialog.component';

describe('EditSkillGroupDialogComponent', () => {
  let component: EditSkillGroupDialogComponent;
  let fixture: ComponentFixture<EditSkillGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSkillGroupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSkillGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
