import { Post } from './post.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({providedIn: "root"})
export class PostService {
   private posts: Post[] = [];
   private subject = new Subject<Post[]>()

   constructor(private http: HttpClient,
               private router: Router) {

   }

   getPosts() {
      this.http
         .get<{message: string; posts: any}>(
            'http://localhost:3000/api/posts'
         )
         .pipe(map(postData => {
            return postData.posts.map(post => {
               return {
                  id: post._id,
                  title: post.title,
                  content: post.content
               }
            })
         }))
         .subscribe(transformedData => {
            this.posts = transformedData;
            this.subject.next([...this.posts]);
         })
   }

   getSubjectListener() {
      return this.subject.asObservable();
   }

   getPost(id: string) {
      // return {...this.posts.find(p => p.id === id)}
      return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/'+id);
   }

   addPost(title: string, content: string) {
      const post: Post = {id: null, title: title, content: content};
      this.http
         .post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
         .subscribe(responseData => {
            console.log(responseData.message);
            post.id = responseData.postId;
            this.posts.push(post);
            this.subject.next([...this.posts]);
            this.router.navigate(['/'])
         })
   }

   updatePost(id: string, title: string, content: string) {
      const post: Post = {id: id, title: title, content: content};
      this.http
         .put('http://localhost:3000/api/posts/'+id, post)
         .subscribe(resposne => {
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id)
            updatedPosts[oldPostIndex] = post;
            this.posts = updatedPosts;
            this.subject.next([...this.posts])
            this.router.navigate(['/'])
         })
   }

   deletePost(postId: string) {
      this.http
         .delete<{message: string}>('http://localhost:3000/api/posts/' + postId)
         .subscribe(response => {
            const updatedPost = this.posts.filter(post => post.id !== postId)
            this.posts = updatedPost;
            this.subject.next([...this.posts])
         })
   }
}