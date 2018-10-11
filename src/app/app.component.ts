import {Component} from '@angular/core';
import {PostModel} from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  posts: PostModel[] = [];

  addPost(postEvent) {
    this.posts.push(postEvent);
  }
}
