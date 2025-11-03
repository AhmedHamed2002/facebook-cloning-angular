import { TestBed } from '@angular/core/testing';

import { FriendShipService } from './friend-ship.service';

describe('FriendShipService', () => {
  let service: FriendShipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendShipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
