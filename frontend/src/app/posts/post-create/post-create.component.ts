import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PostModel } from "../../models/post.model";
import { NgForm } from "@angular/forms";
import { PostsService } from "../../services/posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  @Output() postCreated: EventEmitter<PostModel> = new EventEmitter<PostModel>();

  constructor(private postsService: PostsService) {
  }

  ngOnInit(): void {
  }

  public onAddPost(postForm: NgForm): void {
    const post: PostModel = {
      title: postForm.value.title,
      content: postForm.value.content,
    };

    this.postsService.addPost(post);
    postForm.resetForm();
  }

}
