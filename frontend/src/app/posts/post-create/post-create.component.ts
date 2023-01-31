import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PostModel } from "../../models/post.model";
import { NgForm } from "@angular/forms";
import { PostsService, ResponseModel } from "../../services/posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  @Output() postCreated: EventEmitter<PostModel> = new EventEmitter<PostModel>();

  private mode: string = 'create';
  private postId: string;
  public post: PostModel;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('postId')) {
        this.mode = 'edit';
        this.postId = param.get('postId');
        this.postsService.getPost(this.postId).subscribe({
          next: (response)=> {
            this.post = response;
          }
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = {
          title: '',
          content: '',
        }
      }
    });
  }

  public onSavePost(postForm: NgForm): void {
    const post: PostModel = {
      title: postForm.value.title,
      content: postForm.value.content,
    };

    if (this.mode === 'create') {
      this.postsService.addPost(post);
    } else {
      post._id = this.postId;
      this.postsService.updatePost(post).subscribe({
        next: (response: ResponseModel) => {
          const updatedPosts = [...this.postsService.posts];
          const oldPostIndex = updatedPosts.findIndex(post => post._id === post._id);
          updatedPosts[oldPostIndex] = post;
          this.postsService.posts = updatedPosts;
          this.postsService.postsUpdated$.next([...updatedPosts])
          console.log(response);
        }
      })
    }
    postForm.resetForm();
  }

}
