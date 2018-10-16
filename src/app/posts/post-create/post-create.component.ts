import {Component, OnInit} from '@angular/core';
import { PostService } from '../post.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string;
  public post: Post;
  public isLoading: boolean = false;

  constructor(public postService: PostService,
              public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId)
          .subscribe((data) => {
            this.isLoading = false;
            this.post = {
              id: data._id,
              title: data.title,
              content: data.content
            }
          })
      } else {
        this.mode = 'create'
        this.postId = null;
      }
    })
  }

  onSavePost(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postService.addPost(form.value.title, form.value.content)
    } else if(this.mode === 'edit'){
      this.postService.updatePost(this.postId, form.value.title, form.value.content)
    }
    form.resetForm();
  }
}
