import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService, ResponseModel } from "../../services/posts.service";
import { PostModel } from "../../models/post.model";
import { Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: PostModel[];
  private getPostsSub: Subscription;
  public isLoading: boolean;
  public totalPosts: number = 10;
  public postsPerPage: number = 2;
  public pageSizeOptions = [1, 2, 5, 10];

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

  public onPageChanged(event: PageEvent): void {
    console.log(event)
  }

  ngOnDestroy(): void {
    this.getPostsSub?.unsubscribe();
  }

}
