import {Component, EventEmitter, Output} from '@angular/core';
import {PostModel} from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  @Output() emitPost: EventEmitter<PostModel> = new EventEmitter<PostModel>();

  onAddPost(form) {

    if (!form.valid) {
      return;
    }
    const post: PostModel = {
      title: form.value.title,
      content: form.value.contenct,
    };
    this.emitPost.emit(post);
  }
}
