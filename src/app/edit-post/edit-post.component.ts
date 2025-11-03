import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PostsService } from '../posts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent {
  postForm!: FormGroup;
  previewImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isLoading = true;
  postId!: string;
  isDarkMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.postId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadPostData(this.postId);
  }

  initForm() {
    this.postForm = this.fb.group({
      postId: [this.postId, Validators.required],
      content: ['', [Validators.required, Validators.minLength(3)]],
      visibility: ['public', Validators.required],
      images: [null]
    });
  }

  loadPostData(id: string) {
    this.postsService.getSinglePost(id).subscribe({
      next: (res) => {
        const post = res.data;
        this.postForm.patchValue({
          content: post.content,
          visibility: post.visibility
        });
        this.previewImage = post.images || null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.postForm.patchValue({ images: file });

      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.previewImage = null;
    this.selectedFile = null;
    this.postForm.patchValue({ images: null });
  }

  onSubmit() {
    if (this.postForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please write at least 3 characters',
        confirmButtonColor: '#f1c40f',
        background: this.isDarkMode ? '#1b1b1b' : '#fff',
        color: this.isDarkMode ? '#f3f4f6' : '#111827'
      });
      return;
    }

    const formData = new FormData();
    Object.keys(this.postForm.controls).forEach((key) => {
      const control = this.postForm.get(key);
      if (control && control.value) {
        // Only append images if a file is selected
        if (key === 'images' && this.selectedFile instanceof File) {
          formData.append(key, this.selectedFile);
        } else if (key !== 'images') {
          formData.append(key, control.value);
        }
      }
    });

    this.postsService.editPost(formData).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Post updated successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: this.isDarkMode ? '#1b1b1b' : '#fff',
          color: this.isDarkMode ? '#f3f4f6' : '#111827'
        });
        this.router.navigate(['/profile']);
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
