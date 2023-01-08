import { Injectable } from '@angular/core';
import { PostModel } from "../models/post.model";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

export interface ResponseModel {
  message: string;
  posts: PostModel[];
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: PostModel[] = [];
  private postsUpdated$: Subject<PostModel[]> = new Subject<PostModel[]>();

  constructor(private http: HttpClient) {
  }

  get postsUpdated(): Observable<PostModel[]> {
    return this.postsUpdated$.asObservable();
  }

  public getPosts(): void {
    this.http.get<ResponseModel>('http://localhost:3000/api/posts')
      .subscribe({
        next: (response: ResponseModel) => {
          this.posts = response.posts;
          this.postsUpdated$.next([...this.posts]);
        },
        error: (error: HttpErrorResponse) => {
        },
      })
  }

  public addPost(post: PostModel): void {
    this.posts.push(post);
    this.postsUpdated$.next([...this.posts]);
  }
}
