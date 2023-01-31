import { Injectable } from '@angular/core';
import { PostModel } from "../models/post.model";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

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

  constructor(
    private http: HttpClient,
  ) {
  }

  get postsUpdated(): Observable<PostModel[]> {
    return this.postsUpdated$.asObservable();
  }

  public getPosts(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>('http://localhost:3000/api/posts');
  }

  public getPost(id: string): Observable<PostModel> {
    return this.http.get<PostModel>('http://localhost:3000/api/posts/' + id);
  }

  public addPost(post: PostModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('http://localhost:3000/api/posts', post);
  }

  public updatePost(post: PostModel): Observable<ResponseModel> {
    return this.http.put<ResponseModel>('http://localhost:3000/api/posts/' + post._id, post);
  }

  public deletePost(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>('http://localhost:3000/api/posts/' + id);
  }
}
