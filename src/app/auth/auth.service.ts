import { Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model'
import { Subject } from 'rxjs'
import { Router } from '@angular/router';
@Injectable({providedIn: "root"})

export class AuthService {
   private token: string;
   private authStatusListener = new Subject<boolean>()
   private isAuthenticated = false;
   private tokenTimer: any;
   private userId: string


   constructor(private http: HttpClient, private router: Router) {}

   getToken() {
      return this.token;
    }

    getUserId() {
       return this.userId;
    }

    getAuthStatusListener() {
       return this.authStatusListener.asObservable();
    }

    getIsAuth() {
      return this.isAuthenticated;
    }

   createUser(email: string, password: string) {
      const authData: AuthData = { email: email, password: password };
      this.http
        .post('http://localhost:3000/api/user/signup', authData)
        .subscribe(response => {
          console.log(response);
          this.router.navigate(['/'])
        });
    }

    //implemented interceptor - auth-interceptor which sets the headers - ahthonitication tocken
    login(email: string, password: string) {
       const authData: AuthData = {email: email, password: password};
       this.http
         .post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', authData)
         .subscribe(response => {
            const token = response.token;
            this.token = token;
            if(token) {
               this.userId = response.userId;
               const expiresInDuration = response.expiresIn;
               this.tokenTimer = setTimeout(() => {
                  this.logout();
               }, expiresInDuration * 1000)
               this.isAuthenticated = true;
               this.authStatusListener.next(true);
               console.log(email);
               this.router.navigate(['/']);
            }
         }) 
    }

    logout() {
      this.token = null;
      this.isAuthenticated = false;
      this.userId = null;
      this.authStatusListener.next(false);
      clearTimeout(this.tokenTimer)
      this.router.navigate(['/login'])
    }
}




