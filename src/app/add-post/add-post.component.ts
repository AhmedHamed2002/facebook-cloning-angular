import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PostsService } from '../posts.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent implements OnInit {
  postForm: FormGroup;
  selectedFile: File | null = null;
  isDarkMode = false;

  constructor(private fb: FormBuilder, private postService: PostsService , private router: Router) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
      visibility: ['public'],
    });
  }

  ngOnInit(): void {
    // detect dark mode
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
  }

  // when user selects an image
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // submit post
  onSubmit() {
    if (this.postForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please write at least 3 characters',
        confirmButtonColor: '#f1c40f',
        background: this.isDarkMode ? '#1b1b1b' : '#fff',
        color: this.isDarkMode ? '#f3f4f6' : '#111827',
      });
      return;
    }

    const formData = new FormData();
    formData.append('content', this.postForm.value.content);
    formData.append('visibility', this.postForm.value.visibility);

    if (this.selectedFile) {
      formData.append('images', this.selectedFile);
    }

    this.postService.createPost(formData).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Post published successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: this.isDarkMode ? '#1b1b1b' : '#fff',
          color: this.isDarkMode ? '#f3f4f6' : '#111827',
        });

        this.postForm.reset({ visibility: 'public' });
        this.selectedFile = null;
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        if (err.error?.status === 'fail') {
          Swal.fire({
            icon: 'warning',
            title: 'Warning!',
            text: err.error?.data || 'Post creation failed',
            confirmButtonColor: '#f1c40f',
            background: this.isDarkMode ? '#1b1b1b' : '#fff',
            color: this.isDarkMode ? '#f3f4f6' : '#111827',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.error?.message || 'Something went wrong!',
            confirmButtonColor: '#e74c3c',
            background: this.isDarkMode ? '#1b1b1b' : '#fff',
            color: this.isDarkMode ? '#f3f4f6' : '#111827',
          });
        }
      },
    });
  }
}
