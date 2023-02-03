import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService, ResponseModel } from "../../services/posts.service";
import { PostModel } from "../../models/post.model";
import { Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: PostModel[];
  private getPostsSub: Subscription;
  public isLoading: boolean;

  constructor(private postsService: PostsService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts()
      .subscribe({
        next: (response: ResponseModel) => {
          this.posts = response.posts;
          console.log(this.posts)
          this.postsService.postsUpdated$.next([...this.posts]);
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
        },
      });
  }

  public onDelete(id: string): void {
    this.postsService.deletePost(id)
      .subscribe({
        next: () => {
          this.posts = this.posts.filter(post => post._id !== id);
          this.postsService.postsUpdated$.next([...this.posts])
        }
      });
  }

  ngOnDestroy(): void {
    this.getPostsSub?.unsubscribe();
  }

}
