import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { UserModel } from "../models/user.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token: string;

  constructor(private http: HttpClient) {
  }

  public getToken(): string {
    return this.token;
  }

  public createUser(userData: UserModel): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/signup`, userData);
  }

  public login(userData: UserModel): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/login`, userData);
  }

}
