import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  public enteredValue: string;
  public newPost: string = 'NO CONTENT';

  constructor() { }

  ngOnInit(): void {
  }

  public onAddPost(): void {
    this.newPost = this.enteredValue;
  }

}
