import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PostModel } from "../../models/post.model";
import { NgForm } from "@angular/forms";
import { PostsService, ResponseModel } from "../../services/posts.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

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
  public isLoading: boolean;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('postId')) {
        this.mode = 'edit';
        this.postId = param.get('postId');
        this.isLoading = true;

        this.postsService.getPost(this.postId).subscribe({
          next: (response) => {
            this.isLoading = false;
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
    this.isLoading = true;

    const post: PostModel = {
      title: postForm.value.title,
      content: postForm.value.content,
    };

    if (this.mode === 'create') {
      this.postsService.addPost(post)
        .subscribe({
          next: (response: ResponseModel) => {
            post._id = response.postId;
            this.postsService.posts.push(post);
            this.postsService.postsUpdated$.next([...this.postsService.posts]);
            this.router.navigate(['/']);
          },
          error: () => {
          },
        });
    } else {
      post._id = this.postId;
      this.postsService.updatePost(post).subscribe({
        next: (response: ResponseModel) => {
          const updatedPosts = [...this.postsService.posts];
          const oldPostIndex = updatedPosts.findIndex(post => post._id === post._id);
          updatedPosts[oldPostIndex] = post;
          this.postsService.posts = updatedPosts;
          this.postsService.postsUpdated$.next([...updatedPosts]);
          this.router.navigate(['/']);
        }
      })
    }
    postForm.resetForm();
  }

}
