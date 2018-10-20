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
  public isLoading: boolean = false;
  constructor(public postService: PostService) {

  }
  posts: Post[] = [];

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService.getSubjectListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      })
  }

  onDeletePost(id: string) {
    this.postService.deletePost(id);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
