import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public isLoading: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  public onLogin(loginForm: NgForm): void {
    console.log(loginForm.value)
  }

}
