import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public isLoading: boolean;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  public onSignup(signupForm: NgForm): void {
    if(signupForm.invalid) {
      return;
    }

    this.authService.createUser(signupForm.value).subscribe(res => {
      console.log(res)
    });
  }

}
