import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterLink]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  isDarkMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // قراءة حالة الثيم من localStorage
    this.isDarkMode = localStorage.getItem('theme') === 'dark';

    const token = localStorage.getItem('facebook_token');
    if (token) {
      this.userService.checkToken().subscribe({
        next: (res) => {
          if (res.status === 'success') {
            localStorage.setItem('facebook_logged', 'true');
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'info',
              title: 'You are already logged in',
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
              background: this.isDarkMode ? '#1b1b1b' : '#fff',
              color: this.isDarkMode ? '#f3f4f6' : '#111827',
            });
            this.router.navigate(['/home']);
          }
        },
        error: () => {
          localStorage.removeItem('facebook_token');
        }
      });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.userService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status === 'success') {
          localStorage.setItem('facebook_token', res.token);

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

          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.error.status === 'fail') {
          Swal.fire({
            icon: 'warning',
            title: 'Warning!',
            text: err.error?.data || 'Login failed',
            confirmButtonColor: '#f1c40f',
            background: this.isDarkMode ? '#1b1b1b' : '#fff',
            color: this.isDarkMode ? '#f3f4f6' : '#111827',
          });
        } else if (err.error.status === 'error') {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message || 'Login failed',
            confirmButtonColor: '#e74c3c',
            background: this.isDarkMode ? '#1b1b1b' : '#fff',
            color: this.isDarkMode ? '#f3f4f6' : '#111827',
          });
        }
      },
    });
  }
}
