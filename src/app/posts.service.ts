import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private apiUrl = `${environment.BASE_URL}/post`;

  constructor(private http: HttpClient) {}


  // Create a new post
  createPost(data: FormData): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.post(`${this.apiUrl}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Edit a post
  editPost(data: FormData): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.put(`${this.apiUrl}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }


 // Delete a post
  deletePost(postId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.delete(`${this.apiUrl}/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Get all public posts
  getAllPublicPosts(): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.get(`${this.apiUrl}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Get posts of friends
  getFriendsPosts(): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.get(`${this.apiUrl}/friends`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Get posts of a specific user
  getUserPosts(userId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.get(`${this.apiUrl}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Get Single Post
  getSinglePost(postId: string): Observable<any> {
    const token = localStorage.getItem('facebook_token');
    return this.http.get(`${this.apiUrl}/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
