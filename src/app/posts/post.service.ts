import { Post } from './post.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({providedIn: "root"})
export class PostService {
   private posts: Post[] = [];
   private subject = new Subject<Post[]>()

   getPosts() {
      return [...this.posts]
   }

   getSubjectListener() {
      return this.subject.asObservable();
   }

   addPost(title: string, content: string) {
      const post: Post = {title: title, content: content};
      this.posts.push(post);
      this.subject.next([...this.posts]);
   }
}