import { Component } from '@angular/core';
import { PostsService } from '../posts.service';
import { UserService } from '../user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ReactionService } from '../reaction.service';

@Component({
  selector: 'app-friends-post',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './friends-post.component.html',
  styleUrl: './friends-post.component.css'
})
export class FriendsPostComponent {
  profile: any;
  posts: any[] = [];
  isLoading = true;
  isDarkMode = false;

  constructor(private postsService: PostsService , private UserService: UserService , private reactionService: ReactionService , private router: Router) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.loadProfileAndPosts();
  }


    loadProfileAndPosts() {
      this.UserService.profile().subscribe({
        next: (res) => {
          this.profile = res.data.myProfile;

          this.postsService.getFriendsPosts().subscribe({
            next: (postRes) => {
              this.posts = postRes.data;
              this.loadReactionsForPosts();
              this.isLoading = false;
            },
            error: (err) => {
              this.isLoading = false;
            }
          });
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

    loadReactionsForPosts() {
      this.posts.forEach(post => {
        // تهيئة افتراضية
        post.userReaction = { type: null, userId: this.profile._id };
        post.likes = [];

        this.reactionService.getReactions(post._id).subscribe({
          next: (reactionData: any) => {
            post.likes = reactionData.data.map((r: any) => ({
              type: r.type,
              userId: r.userId._id,
              name: r.userId.name,
              profileImage: r.userId.profileImage
            }));

            const myReaction = reactionData.data.find((r: any) => r.userId._id === this.profile._id);
            if (myReaction) {
              post.userReaction = { type: myReaction.type, userId: this.profile._id };
            }
          },
          error: (err) => console.error('خطأ في تحميل الريأكشنات:', err)
        });
      });
    }

  // ---------------- Reaction Methods ----------------
  toggleReaction(post: any, type: string) {
    const userId = this.profile._id;

    if (post.userReaction?.type === type) {
      // Remove reaction
      this.reactionService.removeReaction(post._id).subscribe({
        next: () => {
          post.userReaction.type = null;
          post.likes = post.likes.filter((r: any) => r.userId !== userId);
        },
        error: (err) => console.error(err)
      });
      return;
    }

    // Add/update reaction
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
      error: (err) => console.error(err)
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

  goToAddPost() {
    this.router.navigate(['/add_post']);
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
      this.postsService.deletePost(postId).subscribe({
        next: (res) => {
          if (res.status === 'success') {
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
          }
        },
        error: (err) => {
          if (err.error.status === 'fail') {
            Swal.fire({
              icon: 'warning',
              title: 'Warning!',
              text: err.error?.data ,
              confirmButtonColor: '#f1c40f',
              background: this.isDarkMode ? '#1b1b1b' : '#fff',
              color: this.isDarkMode ? '#f3f4f6' : '#111827',
            });
          } else if (err.error.status === 'error') {
            console.log(err.error.message);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: err.error?.message,
              confirmButtonColor: '#e74c3c',
              background: this.isDarkMode ? '#1b1b1b' : '#fff',
              color: this.isDarkMode ? '#f3f4f6' : '#111827',
            });
          }
        }
      });
    }
    });
  }
}
