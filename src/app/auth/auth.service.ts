import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";

import { UserModel } from "./user.model";
import {environment} from "../../environments/environment";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

export interface AuthResposeData {
    idToken:	string;
    email:	string;
    refreshToken:	string;
    expiresIn:	string;
    localId:	string;
    registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService{

  // user = new BehaviorSubject<UserModel>(null);
  private tokenExpirationTimer: any;

constructor(private http: HttpClient,
            private router: Router,
            private store: Store<fromApp.AppState>){}

  singUp(email:string, password:string){
    return this.http.post<AuthResposeData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
    )
    .pipe(catchError(this.handleError), tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn);
    })
    );
  }

  login(email:string, password:string){
    return this.http.post<AuthResposeData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
    {
      email: email,
      password: password,
      returnSecureToken: true
    }
    )
    .pipe(catchError(this.handleError),tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn);
    }));
  }

  autoLogin(){
   const userData: {
     email: string;
     id: string;
     _token:string;
     _tokenExpirationDate: string;
   } =  JSON.parse(localStorage.getItem('userData'));
   if(!userData){
     return;
   }

   const loadedUser = new UserModel(
     userData.email,
     userData.id,
     userData._token,
     new Date(userData._tokenExpirationDate)
   );

   if(loadedUser.token){
    //  this.user.next(loadedUser);
    this.store.dispatch(new AuthActions.Login({
      email: loadedUser.email,
      userId: loadedUser.id,
      token: loadedUser.token,
      expirationDate: new Date(userData._tokenExpirationDate)
    }))

     const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
     this.autoLogout(expirationDuration);
   }
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer =  setTimeout(() => {
      this.logout();
    },expirationDuration);
  }

  logout(){
      // this.user.next(null);
      this.store.dispatch(new AuthActions.Logout());
      this.router.navigate(['/auth']);
      // localStorage.clear();
      localStorage.removeItem('userData');
      if(this.tokenExpirationTimer){
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
  }

  private handleAuthentication(email:string, userId:string, token:string,expiresIn:number){
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new UserModel(email,userId,token,expirationDate);
        // this.user.next(user);
        this.store.dispatch(new AuthActions.Login({
          email: email,
          userId:userId,
          token:token,
          expirationDate: expirationDate
        }));
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData',JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse){
      let errorMessage = 'An Signup Error';
      return throwError(errorMessage);
  }
}
