import {Component, OnInit} from '@angular/core';
import { PostService } from '../post.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model'
import { mimeType} from './mime-type.validator'

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
  public postForm: FormGroup;
  public imagePreview: any;

  constructor(public postService: PostService,
              public route: ActivatedRoute) {

  }

  ngOnInit() {
    this.postForm = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    })
    
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
              content: data.content,
              imagePath: data.imagePath
            }
            this.postForm.setValue({
              title: this.post.title, 
              content: this.post.content, 
              image: this.post.imagePath})
          })
      } else {
        this.mode = 'create'
        this.postId = null;
      }
    })
  }

  onImagePicked(event: Event) {
    // const file = event.target.files[0];
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('image').updateValueAndValidity(); 

    const reader = new FileReader();
    reader.onload = () => {     //this is asychnonious code... this will run after the reader.readAsDataURL(file);
      this.imagePreview = reader.result
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (!this.postForm.valid) {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create') {
      this.postService.addPost(
        this.postForm.value.title, 
        this.postForm.value.content, 
        this.postForm.value.image)
    } else if(this.mode === 'edit'){
      this.postService.updatePost(
        this.postId, 
        this.postForm.value.title, 
        this.postForm.value.content,
        this.postForm.value.image)
    }
    this.postForm.reset();
  }
}
