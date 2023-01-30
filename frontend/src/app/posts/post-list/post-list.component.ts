import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from "../../services/posts.service";
import { PostModel } from "../../models/post.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: PostModel[];
  private getPostsSub: Subscription;

  constructor(private postsService: PostsService) {
  }

  ngOnInit(): void {
    this.postsService.getPosts();
    this.postsService.postsUpdated
      .subscribe((posts: PostModel[]) => {
        this.posts = posts;
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
