import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.BASE_URL}/comments`;

  constructor(private http: HttpClient) {}

  // ✅ Get all comments for a post
  getComments(postId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.get(`${this.apiUrl}/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // ✅ Add a comment
  addComment(postId: string, text: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.post(
      `${this.apiUrl}/${postId}`,
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  // ✅ Delete a comment
  deleteComment(postId: string, commentId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.delete(`${this.apiUrl}/${postId}/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
