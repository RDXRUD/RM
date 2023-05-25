import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeUpdateDialogComponent } from './employee-update-dialog.component';

describe('EmployeeUpdateDialogComponent', () => {
  let component: EmployeeUpdateDialogComponent;
  let fixture: ComponentFixture<EmployeeUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeUpdateDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
