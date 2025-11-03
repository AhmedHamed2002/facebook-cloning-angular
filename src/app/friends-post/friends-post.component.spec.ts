import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsPostComponent } from './friends-post.component';

describe('FriendsPostComponent', () => {
  let component: FriendsPostComponent;
  let fixture: ComponentFixture<FriendsPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendsPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendsPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
