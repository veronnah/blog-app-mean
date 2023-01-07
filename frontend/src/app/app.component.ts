import { Component } from '@angular/core';
import { PostModel } from "./models/post.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public storedPosts: PostModel[] = [];

  public onPostAdded(post: PostModel): void {
    this.storedPosts.push(post);
  }
}
