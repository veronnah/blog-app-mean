import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { UserModel } from "../models/user.model";
import { Observable, Subject } from "rxjs";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SignupResponseModel } from "../models/signupResponse.model";
import { LoginResponseModel } from "../models/loginResponse.model";
import { AuthDataModel } from "../models/authData.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token: string;
  public userId: string;
  public tokenTimer: NodeJS.Timer;
  public authStatusListener: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  public getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  public getToken(): string {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public createUser(userData: UserModel): Observable<SignupResponseModel> {
    return this.http.post<SignupResponseModel>(`${environment.apiUrl}/user/signup`, userData);
  }

  public login(userData: UserModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(`${environment.apiUrl}/user/login`, userData);
  }

  public saveAuthData(token: string, expirationDate: Date, userId: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  public getAuthData(): AuthDataModel {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    }
  }

  public autoAuthUser(): void {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }

    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.userId = authInfo.userId;
      this.launchLogoutTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  public launchLogoutTimer(expiresInDuration): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
      this.snackBar.open(
        'Your session is expired. Please login again', 'OK', {
          duration: 4000,
        });
    }, expiresInDuration * 1000); // multiplied by 1000 to provide it in milliseconds
  }

  public logout(): void {
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.authStatusListener.next(false);
    this.userId = null;
    this.router.navigate(['/']);
  }

}
