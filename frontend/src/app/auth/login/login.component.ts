import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public isLoading: boolean;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  public onLogin(loginForm: NgForm): void {
    console.log(loginForm.value)
    if(loginForm.invalid) {
      return;
    }

    this.authService.login(loginForm.value)
      .subscribe(res => {
        console.log(res)
      })
  }

}
