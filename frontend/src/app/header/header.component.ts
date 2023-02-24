import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public authListenerSub: Subscription;
  public isUserAuthenticated: boolean;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe({
        next: (isAuthenticated: boolean) => {
          this.isUserAuthenticated = isAuthenticated;
        }
      });
  }

  public onLogout(): void {
    this.authService.token = null;
    this.authService.authStatusListener.next(false);
  }

  ngOnDestroy(): void {
    this.authListenerSub?.unsubscribe();
  }

}
