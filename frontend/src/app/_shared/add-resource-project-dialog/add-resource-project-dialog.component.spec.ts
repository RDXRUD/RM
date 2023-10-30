import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResourceProjectDialogComponent } from './add-resource-project-dialog.component';

describe('AddResourceProjectDialogComponent', () => {
  let component: AddResourceProjectDialogComponent;
  let fixture: ComponentFixture<AddResourceProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddResourceProjectDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddResourceProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
