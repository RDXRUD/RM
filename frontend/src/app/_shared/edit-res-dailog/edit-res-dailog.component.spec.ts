import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResDailogComponent } from './edit-res-dailog.component';

describe('EditResDailogComponent', () => {
  let component: EditResDailogComponent;
  let fixture: ComponentFixture<EditResDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditResDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditResDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
