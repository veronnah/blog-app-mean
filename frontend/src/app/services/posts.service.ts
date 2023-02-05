import { Injectable } from '@angular/core';
import { PostModel } from "../models/post.model";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface ResponseModel {
  message: string;
  posts?: PostModel[];
  post?: any,
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

  public getPosts(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>('http://localhost:3000/api/posts');
  }

  public getPost(id: string): Observable<PostModel> {
    return this.http.get<PostModel>('http://localhost:3000/api/posts/' + id);
  }

  public addPost(post: PostModel): Observable<ResponseModel> {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image);

    return this.http.post<ResponseModel>('http://localhost:3000/api/posts', postData);
  }

  public updatePost(post: PostModel): Observable<ResponseModel> {
    let postData;
    if (typeof (post.image) === 'object') {
      postData = new FormData();
      postData.append('id', post._id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.image, post.title);
    } else {
      postData = {
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.image,
      };
      console.log(postData);
    }
    return this.http.put<ResponseModel>('http://localhost:3000/api/posts/' + post._id, postData);
  }

  public deletePost(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>('http://localhost:3000/api/posts/' + id);
  }
}
