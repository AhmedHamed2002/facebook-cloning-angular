import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private apiUrl = `${environment.BASE_URL}/reaction`;

  constructor(private http: HttpClient) {}

  // ✅ Add or update reaction
  addReaction(postId: string, type: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.post(
      `${this.apiUrl}`,
      { postId, type },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  // ✅ Remove reaction
  removeReaction(postId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.delete(`${this.apiUrl}`, {
      headers: { Authorization: `Bearer ${token}` },
      body: { postId },
    });
  }

  // ✅ Get all reactions for a post
  getReactions(postId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.get(`${this.apiUrl}/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
