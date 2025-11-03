import { Component } from '@angular/core';
import { CommentService } from '../comment.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-view-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './view-comments.component.html',
  styleUrl: './view-comments.component.css'
})
export class ViewCommentsComponent {
  postId!: string;
  comments: any[] = [];
  newComment: string = '';
  loading: boolean = true;
  authorId: string = '';
  userId: string = '';


  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id')!;
    this.loadComments();
  }

  loadComments() {
    this.loading = true;
    this.commentService.getComments(this.postId).subscribe({
      next: (res) => {
        this.comments = res.data;
        this.userId = res.userId;
        this.authorId = res.authorId;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;
    this.commentService.addComment(this.postId, this.newComment).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments(); // ✅ refresh after add
      },
    });
  }

  deleteComment(commentId: string) {
    this.commentService.deleteComment(this.postId, commentId).subscribe({
      next: () => {
        this.loadComments(); // ✅ refresh after delete
      },
    });
  }
}
