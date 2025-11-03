import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReactionsComponent } from './view-reactions.component';

describe('ViewReactionsComponent', () => {
  let component: ViewReactionsComponent;
  let fixture: ComponentFixture<ViewReactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewReactionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
