import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService, ResponseModel } from "../../services/posts.service";
import { PostModel } from "../../models/post.model";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit, OnDestroy {
  public posts: PostModel[];
  private getPostsSub: Subscription;
  private authStatusSub: Subscription;
  private deletePostsSub: Subscription;
  public userId: string;

  public isLoading: boolean = true;
  public isUserAuthenticated: boolean;

  public totalPosts: number;
  public postsPerPage: number = 2;
  public currentPage: number = 1;
  public pageSizeOptions = [1, 2, 5, 10];

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isAuthenticated();
    this.userId = this.authService.userId;

    this.getPosts(this.postsPerPage, this.currentPage);
    this.authStatusListener();
  }

  public authStatusListener(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe({
      next: (isAuthenticated: boolean) => {
        this.isUserAuthenticated = isAuthenticated;
        this.userId = this.authService.userId;
      },
    });
  }

  public getPosts(postsPerPage: number, currentPage): void {
    this.getPostsSub = this.postsService.getPosts(postsPerPage, currentPage)
      .subscribe({
        next: (response: ResponseModel) => {
          this.posts = response.posts;
          this.totalPosts = response.totalPostsNum;
          this.postsService.postsUpdated$.next({
            posts: [...this.posts],
            totalPostsNum: this.totalPosts,
          });
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  public onDelete(id: string): void {
    this.deletePostsSub = this.postsService.deletePost(id)
      .subscribe({
        next: () => {
          this.getPosts(this.postsPerPage, this.currentPage);
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  public onPageChanged(event: PageEvent): void {
    this.isLoading = true;
    const currentPageIndex = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.getPosts(this.postsPerPage, currentPageIndex);
  }

  ngOnDestroy(): void {
    this.getPostsSub?.unsubscribe();
    this.authStatusSub?.unsubscribe();
    this.deletePostsSub?.unsubscribe();
  }

}
