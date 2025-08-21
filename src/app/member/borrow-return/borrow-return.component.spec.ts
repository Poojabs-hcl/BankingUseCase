import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowReturnComponent } from './borrow-return.component';

describe('BorrowReturnComponent', () => {
  let component: BorrowReturnComponent;
  let fixture: ComponentFixture<BorrowReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowReturnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
