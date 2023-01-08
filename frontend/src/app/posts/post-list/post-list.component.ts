import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from "../../services/posts.service";
import { PostModel } from "../../models/post.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy{
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

  ngOnDestroy(): void {
    this.getPostsSub?.unsubscribe();
  }

}
