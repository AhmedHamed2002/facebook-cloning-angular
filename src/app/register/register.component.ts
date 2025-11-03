import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule, CommonModule, RouterLink]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  avatar?: File;
  avatarPreview: string | ArrayBuffer | null = null;
  loading = false;
  isDarkMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      birthday: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        ]
      ],
      confirmPassword: ['', Validators.required],
      profileImage: [''],
      profileImage_public_id: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // قراءة الـ theme من localStorage
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.avatar = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  register() {
    if (this.registerForm.invalid) return;
    this.loading = true;

    const formData = new FormData();
    Object.keys(this.registerForm.value).forEach(key => {
      formData.append(key, this.registerForm.value[key]);
    });
    if (this.avatar) formData.append('profileImage', this.avatar);

    this.userService.register(formData).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status == 'success') {
          Swal.fire({
            toast: true,
            position: 'top-end', 
            icon: 'success',
            title: res.data,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: this.isDarkMode ? '#1b1b1b' : '#fff',
            color: this.isDarkMode ? '#f3f4f6' : '#111827'
          });
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.error.status == 'fail') {
          Swal.fire({
            icon: 'warning',
            title: 'Warning!',
            text: err.error?.data || 'Registration failed',
            confirmButtonColor: '#f1c40f',
            background: this.isDarkMode ? '#1b1b1b' : '#fff',
            color: this.isDarkMode ? '#f3f4f6' : '#111827'
          });
        } else if (err.error.status == 'error') {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message || 'Registration failed',
            confirmButtonColor: '#e74c3c',
            background: this.isDarkMode ? '#1b1b1b' : '#fff',
            color: this.isDarkMode ? '#f3f4f6' : '#111827'
          });
        }
      }
    });
  }

  isInvalid(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }
}
