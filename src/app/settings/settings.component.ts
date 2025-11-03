import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  profileForm!: FormGroup;
  profilePreview: string | ArrayBuffer | null = null;
  backgroundPreview: string | ArrayBuffer | null = null;
  profileFile: File | null = null;
  backgroundFile: File | null = null;
  isDarkMode = false;
  isLoading = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';

    this.profileForm = this.fb.group({
      name: [''],
      bio: [''],
      email: ['', Validators.email],
      address: [''],
      city: [''],
      phone: [''],
      gender: [''],
      birthday: ['']
    });

    // Load profile data
    this.userService.profile().subscribe(res => {
      this.profileForm.patchValue(res.data.myProfile);
      this.profilePreview = res.data.myProfile.profileImage;
      this.backgroundPreview = res.data.myProfile.backgroundImage;
    });
  }

  onProfileImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileFile = file;
      const reader = new FileReader();
      reader.onload = () => this.profilePreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onBackgroundImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.backgroundFile = file;
      const reader = new FileReader();
      reader.onload = () => this.backgroundPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    const formData = new FormData();

    // Append text fields
    Object.keys(this.profileForm.value).forEach(key => {
      const value = this.profileForm.value[key];
      if (value) formData.append(key, value);
    });

    // Append files
    if (this.profileFile) formData.append('profileImage', this.profileFile);
    if (this.backgroundFile) formData.append('backgroundImage', this.backgroundFile);

    this.userService.updateProfile(formData).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully!',
          confirmButtonColor: '#4CAF50',
          background: this.isDarkMode ? '#1b1b1b' : '#fff',
          color: this.isDarkMode ? '#f3f4f6' : '#111827'
        });
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.isLoading = false;
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
