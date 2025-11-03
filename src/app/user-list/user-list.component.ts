import { Component } from '@angular/core';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FriendShipService } from '../friend-ship.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: any[] = [];
  isLoading = true;
  isDarkMode: boolean = false;
  friendRequests: any[] = [];

  constructor(
    private userService: UserService,
    private friendshipService: FriendShipService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';

    // load all users
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data;
        this.isLoading = false;
      },
      error: (err) => this.showError(err)
    });

    // load friend requests
    this.userService.getUserImage().subscribe({
      next: (res) => {
        if (res?.data) this.friendRequests = res.data.friendRequests;
      },
      error: (err) => this.showError(err)
    });
  }

  // ✅ زرار Send Friend Request
  sendFriendRequest(userId: string) {
    this.friendshipService.sendFriendRequest(userId).subscribe({
      next: () => {
        Swal.fire('Success', 'Friend request sent!', 'success');
        this.users = this.users.map(u =>
          u.id === userId ? { ...u, relation: 'pending' } : u
        );
      },
      error: (err) => this.showError(err)
    });
  }

  // ✅ زرار Confirm
  acceptFriendRequest(fromId: string) {
    this.friendshipService.acceptFriendRequest(fromId).subscribe({
      next: () => {
        Swal.fire('Success', 'Friend request accepted!', 'success');
        this.friendRequests = this.friendRequests.filter(r => r._id !== fromId);
      },
      error: (err) => this.showError(err)
    });
  }

  // ✅ زرار Delete
  rejectFriendRequest(fromId: string) {
    this.friendshipService.rejectFriendRequest(fromId).subscribe({
      next: () => {
        Swal.fire('Info', 'Friend request rejected!', 'info');
        this.friendRequests = this.friendRequests.filter(r => r._id !== fromId);
      },
      error: (err) => this.showError(err)
    });
  }

  private showError(err: any) {
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
}
