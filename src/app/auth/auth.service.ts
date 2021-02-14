import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { UserModel } from "./user.model";
import { Router } from "@angular/router";

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

  user = new BehaviorSubject<UserModel>(null);
  private tokenExpirationTimer: any;

constructor(private http: HttpClient,
            private router: Router){}

  singUp(email:string, password:string){
    return this.http.post<AuthResposeData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCDSQy6pFd07wXAXM0m8qxIDe5xTi_HU4E',
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
    return this.http.post<AuthResposeData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCDSQy6pFd07wXAXM0m8qxIDe5xTi_HU4E',
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
     this.user.next(loadedUser);
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
      this.user.next(null);
      this.router.navigate(['/auth']);
      // localStorage.clear();
      localStorage.removeItem('userData');
      if(this.tokenExpirationTimer){
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
  }

  private handleAuthentication(email:string, localId:string, token:string,expiresIn:number){
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new UserModel(email,localId,token,expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData',JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse){
      let errorMessage = 'An Signup Error';
      return throwError(errorMessage);
  }
}
