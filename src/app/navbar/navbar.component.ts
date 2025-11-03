import { Component, AfterViewInit, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Dropdown, initFlowbite } from 'flowbite';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit, OnInit {
  isDarkMode = false;
  isLoggedIn = false;
  avatar: string | null = null;
  username: string | null = null;
  friendRequests: any[] = [];
  role: string | null = null;
  mobileMenuOpen = false;
  searchQuery = '';
  searchResults: any[] = [];
  loading = false;
  private userDropdown: any;

  constructor(
    private renderer: Renderer2,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
  const token = localStorage.getItem('facebook_token');
  this.isLoggedIn = !!token;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    this.isDarkMode = true;
    this.renderer.addClass(document.documentElement, 'dark');
  }

  if (this.isLoggedIn) {
    this.userService.getUserImage().subscribe({
      next: (res) => {
        if (res?.data) {
          this.avatar = res.data.profileImage;
          this.username = res.data.name;
          this.friendRequests = res.data.friendRequests;
        }
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
      }
    });
  }
}

  ngAfterViewInit() {
    const dropdownTrigger = document.getElementById('user-menu-button');
    const dropdownElement = document.getElementById('user-dropdown');

    if (dropdownTrigger && dropdownElement) {
      this.userDropdown = new Dropdown(dropdownElement, dropdownTrigger);
      initFlowbite();
    }
}


  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'light');
    }
  }

  onSearch() {
    if (this.searchQuery.trim().length === 0) {
      this.searchResults = [];
      return;
    }

    this.loading = true;
    this.userService.search(this.searchQuery).subscribe({
      next: (res) => {
        this.loading = false;
        this.searchResults = res.data;
      },
      error: () => {
        this.loading = false;
        this.searchResults = [];
      },
    });
  }


  onLogout() {
    const isDark = this.isDarkMode;

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of EmployeeMS.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isDark ? '#4f46e5' : '#3085d6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1b1b1b' : '#fff',
      color: isDark ? '#f3f4f6' : '#111827',
      customClass: {
        popup: 'rounded-xl shadow-lg',
        confirmButton: 'px-4 py-2 font-semibold rounded-lg',
        cancelButton: 'px-4 py-2 font-semibold rounded-lg',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.logout().subscribe({
          next: (res) => {
            localStorage.setItem('facebook_logged', 'false');
            localStorage.removeItem('facebook_token');
            this.isLoggedIn = false;
            this.avatar = null;
            this.router.navigate(['/login']);

            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: res.data,
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              background: isDark ? '#1b1b1b' : '#fff',
              color: isDark ? '#f3f4f6' : '#111827',
            });
          },
          error: (err) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: err.error?.message || 'Something went wrong',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              background: isDark ? '#1b1b1b' : '#fff',
              color: isDark ? '#f3f4f6' : '#111827',
            });
          },
        });
      }
    });
  }

  closeSearchResults(): void {
    this.searchResults = [];
  }

 toggleNavbar() {
  const navbar = document.getElementById('navbar-menu');
  this.mobileMenuOpen = !this.mobileMenuOpen;

  if (navbar) {
    if (this.mobileMenuOpen) {
      navbar.classList.remove('hidden');
    } else {
      navbar.classList.add('hidden');
    }
  }
}

closeUserDropdown() {
  if (this.userDropdown) {
    this.userDropdown.hide();
  }
}


closeNavbar() {
  const navbar = document.getElementById('navbar-menu');
  this.mobileMenuOpen = false;
  if (navbar) {
    navbar.classList.add('hidden');
  }
}
}
