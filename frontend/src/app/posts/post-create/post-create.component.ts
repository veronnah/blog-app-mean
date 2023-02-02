import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PostModel } from "../../models/post.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
  public form: FormGroup;
  public imagePreview: string | ArrayBuffer;

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
            this.form.patchValue(this.post);
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
    this.initForm();
  }

  public initForm(): void {
    this.form = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl('', {
        validators: [Validators.required]
      }),
      image: new FormControl('', {
        validators: Validators.required,
      }),
    })
  }

  public onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});

    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  public onSavePost(): void {
    this.isLoading = true;

    const post: PostModel = this.form.value;

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
    this.form.reset();
  }

}
