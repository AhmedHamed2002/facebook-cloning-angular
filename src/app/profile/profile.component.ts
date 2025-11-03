import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';
import { PostsService } from '../posts.service';
import { ReactionService } from '../reaction.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any;
  posts: any[] = [];
  isLoading = true;
  isDarkMode: boolean = false;

  constructor(
    private UserService: UserService,
    private PostsService: PostsService,
    private reactionService: ReactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.loadProfile();
  }

  loadProfile() {
    this.UserService.profile().subscribe({
      next: (res) => {
        this.profile = res.data.myProfile;
        this.posts = res.data.posts;

        this.posts.forEach(post => {
          this.reactionService.getReactions(post._id).subscribe({
            next: (reactionData: any) => {
              const myReaction = reactionData.data.find((r: any) => r.userId._id === this.profile._id);
              post.userReaction = myReaction ? { type: myReaction.type, userId: this.profile._id } : { type: null, userId: this.profile._id };

              post.likes = reactionData.data.map((r: any) => ({
                type: r.type,
                userId: r.userId._id,
                name: r.userId.name,
                profileImage: r.userId.profileImage
              }));
            },
            error: (err) => console.error('Get reactions error:', err)
          });
        });

        this.isLoading = false;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err.error?.message || 'Something went wrong!',
          confirmButtonColor: '#e74c3c',
          background: this.isDarkMode ? '#1b1b1b' : '#fff',
          color: this.isDarkMode ? '#f3f4f6' : '#111827'
        });
        this.isLoading = false;
      }
    });
  }

  toggleReaction(post: any, type: string) {
    const userId = this.profile._id;

    if (post.userReaction?.type === type) {
      // حذف الريأكشن
      this.reactionService.removeReaction(post._id).subscribe({
        next: () => {
          post.userReaction.type = null;
          post.likes = post.likes.filter((r: any) => r.userId !== userId);
        },
        error: (err) => console.error('Remove reaction error:', err)
      });
      return;
    }

    // إضافة أو تعديل الريأكشن
    this.reactionService.addReaction(post._id, type).subscribe({
      next: () => {
        post.userReaction = { type, userId };
        const existing = post.likes.find((r: any) => r.userId === userId);
        if (existing) {
          existing.type = type;
        } else {
          post.likes.push({ type, userId, name: this.profile.name, profileImage: this.profile.profileImage });
        }
      },
      error: (err) => console.error('Add reaction error:', err)
    });
  }

  chooseReaction(post: any, type: string) {
    this.toggleReaction(post, type);
    post.showReactions = false;
  }

  getUniqueReactions(likes: any[]): string[] {
    return [...new Set(likes.map(l => l.type))];
  }

  getReactionIcon(type: string): string {
    switch (type) {
      case 'like': return 'fa-solid fa-thumbs-up text-blue-500';
      case 'love': return 'fa-solid fa-heart text-red-500';
      case 'haha': return 'fa-solid fa-face-laugh-squint text-yellow-500';
      case 'wow': return 'fa-solid fa-face-surprise text-yellow-400';
      case 'sad': return 'fa-solid fa-face-sad-tear text-blue-400';
      case 'angry': return 'fa-solid fa-face-angry text-red-600';
      default: return 'fa-regular fa-thumbs-up text-gray-400';
    }
  }

  goToReactions(postId: string) {
    this.router.navigate(['/view_reactions', postId]);
  }

  goToFriendProfile(friendId: string) {
    this.router.navigate(['/user_profile', friendId]);
  }

  goToAllFriends() {
    this.router.navigate(['/myfriends']);
  }

  goToAddPost() {
    this.router.navigate(['/add_post']);
  }

  goToEditPost(postId: string) {
    this.router.navigate(['/edit_post', postId]);
  }

  deletePost(postId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      background: this.isDarkMode ? '#1b1b1b' : '#fff',
      color: this.isDarkMode ? '#f3f4f6' : '#111827',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.PostsService.deletePost(postId).subscribe({
          next: (res) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: res.data,
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              background: this.isDarkMode ? '#1b1b1b' : '#fff',
              color: this.isDarkMode ? '#f3f4f6' : '#111827',
            });
            this.posts = this.posts.filter(p => p._id !== postId);
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: err.error?.message,
              confirmButtonColor: '#e74c3c',
              background: this.isDarkMode ? '#1b1b1b' : '#fff',
              color: this.isDarkMode ? '#f3f4f6' : '#111827',
            });
          }
        });
      }
    });
  }
}
