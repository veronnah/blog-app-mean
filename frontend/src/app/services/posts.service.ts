import { Injectable } from '@angular/core';
import { PostModel } from "../models/post.model";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: PostModel[] = [];
  private postsUpdated$: Subject<PostModel[]> = new Subject<PostModel[]>();

  get postsUpdated(): Observable<PostModel[]> {
    return this.postsUpdated$.asObservable();
  }

  public getPosts(): PostModel[] {
    return [...this.posts];
  }

  public addPost(post: PostModel): void {
    this.posts.push(post);
    this.postsUpdated$.next([...this.posts]);
  }
}
