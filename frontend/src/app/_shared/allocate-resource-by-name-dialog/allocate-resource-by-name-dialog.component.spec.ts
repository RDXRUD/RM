import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocateResourceByNameDialogComponent } from './allocate-resource-by-name-dialog.component';

describe('AllocateResourceByNameDialogComponent', () => {
  let component: AllocateResourceByNameDialogComponent;
  let fixture: ComponentFixture<AllocateResourceByNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllocateResourceByNameDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocateResourceByNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
