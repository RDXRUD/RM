import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTasknameDialogComponent } from './view-taskname-dialog.component';

describe('ViewTasknameDialogComponent', () => {
  let component: ViewTasknameDialogComponent;
  let fixture: ComponentFixture<ViewTasknameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTasknameDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTasknameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
