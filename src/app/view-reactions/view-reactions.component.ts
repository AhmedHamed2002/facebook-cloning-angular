import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactionService } from '../reaction.service';

@Component({
  selector: 'app-view-reactions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-reactions.component.html',
  styleUrls: ['./view-reactions.component.css'],
})
export class ViewReactionsComponent implements OnInit {
  postId!: string;
  allReactions: any[] = [];
  activeTab: string = 'all';
  loading: boolean = true;
  authorId: string = '';

  tabs = [
    { key: 'all', label: 'All', icon: 'fa-solid fa-users' },
    { key: 'like', label: 'Like', icon: 'fa-solid fa-thumbs-up text-blue-500' },
    { key: 'love', label: 'Love', icon: 'fa-solid fa-heart text-red-500' },
    { key: 'haha', label: 'Haha', icon: 'fa-solid fa-face-laugh-squint text-yellow-500' },
    { key: 'wow', label: 'Wow', icon: 'fa-solid fa-face-surprise text-yellow-400' },
    { key: 'sad', label: 'Sad', icon: 'fa-solid fa-face-sad-tear text-blue-400' },
    { key: 'angry', label: 'Angry', icon: 'fa-solid fa-face-angry text-red-600' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reactionService: ReactionService
  ) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id')!;
    this.loadReactions();
  }

  loadReactions() {
    this.loading = true;
    this.reactionService.getReactions(this.postId).subscribe({
      next: (res: any) => {
        this.authorId = res.authorId ;
        this.allReactions = res.data.map((r: any) => ({
          _id: r.userId._id,
          name: r.userId.name,
          profileImage: r.userId.profileImage,
          type: r.type,
        }));
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  get filteredReactions() {
    if (this.activeTab === 'all') return this.allReactions;
    return this.allReactions.filter(r => r.type === this.activeTab);
  }

  getReactionIcon(type: string): string {
    switch (type) {
      case 'like': return 'fa-solid fa-thumbs-up text-blue-500';
      case 'love': return 'fa-solid fa-heart text-red-500';
      case 'haha': return 'fa-solid fa-face-laugh-squint text-yellow-500';
      case 'wow': return 'fa-solid fa-face-surprise text-yellow-400';
      case 'sad': return 'fa-solid fa-face-sad-tear text-blue-400';
      case 'angry': return 'fa-solid fa-face-angry text-red-600';
      default: return 'fa-solid fa-thumbs-up text-gray-400';
    }
  }

  goToProfile(userId: string) {
    this.router.navigate(['/user_profile', userId]);
  }
}
