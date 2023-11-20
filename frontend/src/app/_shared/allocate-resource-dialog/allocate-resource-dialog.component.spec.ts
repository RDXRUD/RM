import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateResourceDialogComponent } from './allocate-resource-dialog.component';

describe('AllocateResourceDialogComponent', () => {
  let component: AllocateResourceDialogComponent;
  let fixture: ComponentFixture<AllocateResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocateResourceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
