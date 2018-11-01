import {Component, OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs'
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

  private postsSub: Subscription;
  public isLoading: boolean = false;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  userId: string;

  constructor(public postService: PostService, private authService: AuthService) {

  }
  posts: Post[] = [];

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService.getSubjectListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

  }

  onDeletePost(id: string) {
    this.postService.deletePost(id);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
