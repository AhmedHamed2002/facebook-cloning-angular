import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { PostsService } from '../posts.service';
import { FriendShipService } from '../friend-ship.service';
import { ReactionService } from '../reaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-user-profile',
  standalone: true,
  imports: [CommonModule ,  RouterLink],
  templateUrl: './view-user-profile.component.html',
  styleUrl: './view-user-profile.component.css'
})
export class ViewUserProfileComponent {
  user: any;
  posts: any[] = [];
  isLoading = true;
  isDarkMode = false;
  myProfile: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private postsService: PostsService,
    private friendshipService: FriendShipService,
    private reactionService: ReactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';

    // ✅ أول حاجة نجيب البروفايل عشان نعرف الـ userId الحالي
    this.userService.profile().subscribe({
      next: (res) => {
        this.myProfile = res.data.myProfile;
        this.route.paramMap.subscribe(params => {
          const userId = params.get('id');
          if (userId) {
            this.isLoading = true;
            this.fetchUser(userId);
          }
        });
      }
    });
  }

  fetchUser(userId: string): void {
    this.userService.getSingleUser(userId).subscribe({
      next: (res) => {
        if (res.data === 'this is your profile') {
          this.router.navigate(['/profile']);
          return;
        }

        this.user = res.data;
        this.fetchUserPosts(userId);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  fetchUserPosts(userId: string): void {
    this.postsService.getUserPosts(userId).subscribe({
      next: (res) => {
        this.posts = res.data;

        // ✅ نجيب الريأكشن لكل بوست
        this.posts.forEach(post => {
          this.reactionService.getReactions(post._id).subscribe({
            next: (reactionData: any) => {
              const myReaction = reactionData.data.find(
                (r: any) => r.userId._id === this.myProfile._id
              );

              post.userReaction = myReaction
                ? { type: myReaction.type, userId: this.myProfile._id }
                : { type: null, userId: this.myProfile._id };

              post.likes = reactionData.data.map((r: any) => ({
                type: r.type,
                userId: r.userId._id,
                name: r.userId.name,
                profileImage: r.userId.profileImage
              }));
            }
          });
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // ✅ Manage Friends
  sendFriendRequest(userId: string) {
    this.friendshipService.sendFriendRequest(userId).subscribe({
      next: () => {
        Swal.fire('Success', 'Friend request sent!', 'success');
        this.user.isFriend = 'pending';
      },
      error: (err) => this.showError(err)
    });
  }

  acceptFriendRequest(userId: string) {
    this.friendshipService.acceptFriendRequest(userId).subscribe({
      next: () => {
        Swal.fire('Success', 'Friend request accepted!', 'success');
        this.user.isFriend = true;
      },
      error: (err) => this.showError(err)
    });
  }

  removeFriend(userId: string) {
    this.friendshipService.removeFriend(userId).subscribe({
      next: () => {
        Swal.fire('Removed', 'Friend removed!', 'info');
        this.user.isFriend = 'none';
      },
      error: (err) => this.showError(err)
    });
  }

  rejectFriendRequest(userId: string) {
    this.friendshipService.rejectFriendRequest(userId).subscribe({
      next: () => {
        Swal.fire('Rejected', 'Friend request rejected!', 'info');
        this.user.isFriend = 'none';
      },
      error: (err) => this.showError(err)
    });
  }

  private showError(err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: err.error?.message || 'Something went wrong!',
      confirmButtonColor: '#e74c3c'
    });
  }

  // ✅ Delete Post
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
                text: err.error?.data,
                confirmButtonColor: '#f1c40f',
                background: this.isDarkMode ? '#1b1b1b' : '#fff',
                color: this.isDarkMode ? '#f3f4f6' : '#111827',
              });
            } else if (err.error.status === 'error') {
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

  // ✅ Reactions
  toggleReaction(post: any, type: string) {
    const userId = this.myProfile._id;

    if (post.userReaction?.type === type) {
      this.reactionService.removeReaction(post._id).subscribe({
        next: () => {
          post.userReaction.type = null;
          post.likes = post.likes.filter((r: any) => r.userId !== userId);
        }
      });
      return;
    }

    this.reactionService.addReaction(post._id, type).subscribe({
      next: () => {
        post.userReaction = { type, userId };
        const existing = post.likes.find((r: any) => r.userId === userId);
        if (existing) {
          existing.type = type;
        } else {
          post.likes.push({
            type,
            userId,
            name: this.myProfile.name,
            profileImage: this.myProfile.profileImage
          });
        }
      }
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
}
