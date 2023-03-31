import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerdialogComponent } from './innerdialog.component';

describe('InnerdialogComponent', () => {
  let component: InnerdialogComponent;
  let fixture: ComponentFixture<InnerdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InnerdialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
