import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { LoginResponseModel } from "../../models/loginResponse.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public isLoading: boolean;

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  public onLogin(loginForm: NgForm): void {
    if (loginForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.authService.login(loginForm.value)
      .subscribe({
        next: (response: LoginResponseModel) => {
          const expiresInDuration = response.expiresIn;
          this.authService.token = response.token;
          this.authService.userId = response.userId;

          this.authService.launchLogoutTimer(expiresInDuration);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.authService.saveAuthData(response.token, expirationDate, response.userId);

          this.authService.authStatusListener.next(true);
          this.isLoading = false;
        }
      })
  }

}
