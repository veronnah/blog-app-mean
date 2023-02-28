import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public isLoading: boolean;

  constructor(
    public authService: AuthService,
    public router: Router,
    public snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
  }

  public onSignup(signupForm: NgForm): void {
    if (signupForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.authService.createUser(signupForm.value)
      .subscribe({
        next: (response) => {
          console.log(response.message)
          this.snackBar.open(
            response.message, 'OK', {
              duration: 3000,
            });
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

}
