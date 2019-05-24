import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { User } from './models/user';
import { ErrorHandlerService } from './services/error-handler.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { SnackerService } from './services/snacker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ErrorHandlerService, UserService, SnackerService],
})
export class AppComponent implements OnDestroy, OnInit {
  errors: any = {};
  loading = true;
  isNavbarCollapsed = true;
  isSidebarCollapsed = false;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(public errHandler: ErrorHandlerService,
    public userService: UserService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private snacker: SnackerService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.userService.whoami().subscribe(res => {
      this.userService.authenticatedUser = res;
      this.isSidebarCollapsed = (localStorage.getItem('isSidebarCollapsed') === 'true' ? true : false);
    }, e => {
      this.errHandler.HandleResponseErrors(e);
      this.isSidebarCollapsed = true;
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    localStorage.setItem('isSidebarCollapsed', String(this.isSidebarCollapsed));
  }

  get authenticatedUser() {
    return this.userService.authenticatedUser;
  }

  isUserAuthenticated() {
    return this.userService.authenticatedUser && this.userService.authenticatedUser.id > 0 ? true : false;
  }

  logout() {
    this.loading = true;
    this.userService.logout().subscribe(res => {
      this.userService.authenticatedUser = new User();
      this.snacker.success(res.message);
      this.loading = false;
      this.router.navigate(['/login']);
      this.isSidebarCollapsed = true;
    }, err => {
      const errors = this.errHandler.HandleResponseErrors(err);
      this.snacker.error(errors.message);
      this.loading = false;
    });
  }

  returnToShoppingCart() {
    const p = window.location.port;

    if (p == '4200') {
      window.location.href = window.location.protocol + '//' + window.location.hostname + ':8000/shop/cart/details';
      return;
    } else {
      window.location.href = window.location.protocol + '//' + window.location.hostname + '/shop/cart/details';
    }
  }
}
