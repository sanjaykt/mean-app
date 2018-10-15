import {Component, OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

  private postsSub: Subscription;
  constructor(public postService: PostService) {

  }
  posts: Post[] = [];

  ngOnInit() {
    this.posts = this.postService.getPosts();
    this.postsSub = this.postService.getSubjectListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    })
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
