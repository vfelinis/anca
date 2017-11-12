import { Injectable, Injector } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store';
import { UserState } from '../../store/User';
import { UserService } from '../../services/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  private user: UserState;
  private userService: UserService;
  constructor(private inj: Injector, private router: Router) {
    this.userService = this.inj.get(UserService);
    this.userService.getUser().subscribe(u => this.user = u);
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.user.role.some(r => r === 'admin') && !!this.user.token) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
