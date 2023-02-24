import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { UserModel } from "../models/user.model";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token: string;
  public authStatusListener: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {
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

  public createUser(userData: UserModel): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/signup`, userData);
  }

  public login(userData: UserModel): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/login`, userData);
  }

}
