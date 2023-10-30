import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordDailogComponent } from './reset-password-dailog.component';

describe('ResetPasswordDailogComponent', () => {
  let component: ResetPasswordDailogComponent;
  let fixture: ComponentFixture<ResetPasswordDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordDailogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPasswordDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
