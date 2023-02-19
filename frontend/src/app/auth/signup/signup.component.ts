import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public isLoading: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  public onSignup(signup: NgForm): void {
    console.log(signup.value)
  }

}
