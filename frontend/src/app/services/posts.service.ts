import { Injectable } from '@angular/core';
import { PostModel } from "../models/post.model";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

export interface ResponseModel {
  message: string;
  posts?: PostModel[];
  totalPostsNum?: number,
  post?: any,
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  public posts: PostModel[] = [];
  public postsUpdated$: Subject<any> = new Subject<any>();

  constructor(
    private http: HttpClient,
  ) {
  }

  public getPosts(postsPerPage: number, currentPage: number): Observable<ResponseModel> {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    return this.http.get<ResponseModel>(`${environment.apiUrl}/posts` + queryParams);
  }

  public getPost(id: string): Observable<PostModel> {
    return this.http.get<PostModel>(`${environment.apiUrl}/posts/` + id);
  }

  public addPost(post: PostModel): Observable<ResponseModel> {
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image);

    return this.http.post<ResponseModel>(`${environment.apiUrl}/posts`, postData);
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
        creator: null,
      };
    }
    return this.http.put<ResponseModel>(`${environment.apiUrl}/posts/` + post._id, postData);
  }

  public deletePost(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${environment.apiUrl}/posts/` + id);
  }
}
