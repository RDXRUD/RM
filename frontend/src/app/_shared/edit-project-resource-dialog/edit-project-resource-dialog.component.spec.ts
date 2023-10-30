import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectResourceDialogComponent } from './edit-project-resource-dialog.component';

describe('EditProjectResourceDialogComponent', () => {
  let component: EditProjectResourceDialogComponent;
  let fixture: ComponentFixture<EditProjectResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProjectResourceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProjectResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
