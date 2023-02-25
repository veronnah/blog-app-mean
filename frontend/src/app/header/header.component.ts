import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public authListenerSub: Subscription;
  public isUserAuthenticated: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isAuthenticated();
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe({
        next: (isAuthenticated: boolean) => {
          this.isUserAuthenticated = isAuthenticated;
          this.router.navigate(['/']);
        }
      });
  }

  public onLogout(): void {
   this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub?.unsubscribe();
  }

}
