import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendShipService {
  private apiUrl = `${environment.BASE_URL}/friend`;

  constructor(private http: HttpClient) {}

  sendFriendRequest(toId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.post(`${this.apiUrl}/request`, { toId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  acceptFriendRequest(fromId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.post(`${this.apiUrl}/accept`, { fromId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  rejectFriendRequest(fromId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.post(`${this.apiUrl}/reject`, { fromId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  removeFriend(friendId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.post(`${this.apiUrl}/remove`, { friendId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
