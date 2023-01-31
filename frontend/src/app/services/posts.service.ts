import { Injectable } from '@angular/core';
import { PostModel } from "../models/post.model";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

export interface ResponseModel {
  message: string;
  posts?: PostModel[];
  postId?: string,
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  public posts: PostModel[] = [];
  public postsUpdated$: Subject<PostModel[]> = new Subject<PostModel[]>();

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

  public getPost(id: string): Observable<PostModel> {
    return this.http.get<PostModel>('http://localhost:3000/api/posts/' + id);
  }

  public addPost(post: PostModel): void {
    this.http.post<ResponseModel>('http://localhost:3000/api/posts', post)
      .subscribe({
        next: (response: ResponseModel) => {
          post._id = response.postId;
          this.posts.push(post);
          this.postsUpdated$.next([...this.posts]);
        },
        error: () => {},
      });
  }

  public updatePost(post: PostModel): Observable<ResponseModel> {
    return this.http.put<ResponseModel>('http://localhost:3000/api/posts/' + post._id, post);
  }

  public deletePost(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>('http://localhost:3000/api/posts/' + id);
  }
}
