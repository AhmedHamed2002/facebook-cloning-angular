import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RouterLink } from "@angular/router";
import { FriendShipService } from '../friend-ship.service';

@Component({
  selector: 'app-my-friends',
  standalone: true,
  imports: [CommonModule , RouterLink],
  templateUrl: './my-friends.component.html',
  styleUrl: './my-friends.component.css'
})
export class MyFriendsComponent {
  friends: any[] = [];
  isLoading = true;
  isDarkMode: boolean = false;

  constructor(
    private userService: UserService,
    private friendshipService: FriendShipService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.loadFriends();
  }

  loadFriends() {
    this.userService.profile().subscribe({
      next: (res) => {
        this.friends = res.data.myProfile.friends || [];
        this.isLoading = false;
      },
      error: (err) => this.handleError(err)
    });
  }

  // ✅ زرار Remove Friend
  removeFriend(friendId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this friend?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#7f8c8d',
      confirmButtonText: 'Yes, remove',
      background: this.isDarkMode ? '#1b1b1b' : '#fff',
      color: this.isDarkMode ? '#f3f4f6' : '#111827'
    }).then((result) => {
      if (result.isConfirmed) {
        this.friendshipService.removeFriend(friendId).subscribe({
          next: () => {
            Swal.fire('Removed!', 'Friend has been removed.', 'success');
            this.friends = this.friends.filter(f => f._id !== friendId);
          },
          error: (err) => this.handleError(err)
        });
      }
    });
  }

  private handleError(err: any) {
    this.isLoading = false;
    if (err.error.status === 'fail') {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: err.error?.data || "Something went wrong",
        confirmButtonColor: '#f1c40f',
        background: this.isDarkMode ? '#1b1b1b' : '#fff',
        color: this.isDarkMode ? '#f3f4f6' : '#111827',
      });
    } else if (err.error.status === 'error') {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.error?.message || "Something went wrong",
        confirmButtonColor: '#e74c3c',
        background: this.isDarkMode ? '#1b1b1b' : '#fff',
        color: this.isDarkMode ? '#f3f4f6' : '#111827',
      });
    }
  }
}
