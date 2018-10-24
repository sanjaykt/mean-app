import { Post } from './post.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';
import { post } from 'selenium-webdriver/http';

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
                  content: post.content,
                  imagePath: post.imagePath
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
      return this.http.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/'+id);
   }

   addPost(title: string, content: string, image: string) {
      // const post: Post = {id: null, title: title, content: content};
      const postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title)

      this.http
         .post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
         .subscribe(responseData => {
            const post: Post = {
                  id: responseData.post.id,
                  title: title,
                  content: content,
                  imagePath: responseData.post.imagePath
            }
            this.posts.push(post);
            this.subject.next([...this.posts]);
            this.router.navigate(['/'])
         })
   }

   updatePost(id: string, title: string, content: string, image: File | string) {
      let postData: FormData | Post;
      if(typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title)
      } else {
            postData = {
                  id: id,
                  title: title,
                  content: content,
                  imagePath: image
            }
      }
      this.http
         .put('http://localhost:3000/api/posts/'+id, postData)
         .subscribe(response => {
            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === id)
            const post: Post = {
                  id: id,
                  title: title,
                  content: content,
                  imagePath: ""
            }
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