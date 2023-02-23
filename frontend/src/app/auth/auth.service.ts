import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { UserModel } from "../models/user.model";
import { Observable } from "rxjs";
import { ResponseModel } from "../services/posts.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  public createUser(userData: UserModel): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/signup`, userData);
  }

  public login(userData: UserModel): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/login`, userData);
  }

}
