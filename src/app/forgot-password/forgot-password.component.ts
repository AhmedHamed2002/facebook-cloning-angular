import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  imports: [ReactiveFormsModule, CommonModule ,RouterLink],
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;
    this.loading = true;

    this.userService.forgotPassword(this.forgotForm.value.email).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status === 'success') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: document.documentElement.classList.contains('dark')
              ? '#1b1b1b'
              : '#fff',
            color: document.documentElement.classList.contains('dark')
              ? '#f3f4f6'
              : '#111',
          });
          this.router.navigate(['/reset-password']);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.error.status === 'fail') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: err.error?.data || 'Failed to send email',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: document.documentElement.classList.contains('dark')
              ? '#1b1b1b'
              : '#fff',
            color: document.documentElement.classList.contains('dark')
              ? '#f3f4f6'
              : '#111',
          });
        } else if (err.error.status === 'error') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: err.error?.message || 'Failed to send email',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: document.documentElement.classList.contains('dark')
              ? '#1b1b1b'
              : '#fff',
            color: document.documentElement.classList.contains('dark')
              ? '#f3f4f6'
              : '#111',
          });
        }
      },
    });
  }
}
