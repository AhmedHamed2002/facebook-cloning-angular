import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) return;
    this.loading = true;

    this.userService.resetPassword(this.resetForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status === 'success') {
          Swal.fire({
            toast: true,
            position: 'top',
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
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          toast: true,
          position: 'top',
          icon: err.error.status === 'fail' ? 'warning' : 'error',
          title:
            err.error?.data ||
            err.error?.message ||
            'Something went wrong',
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
      },
    });
  }
}
