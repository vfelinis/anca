import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store';
import { UserState } from '../../store/User';

@Injectable()
export class AdminGuard implements CanActivate {
  private user: UserState;
  constructor(private store: Store<ApplicationState>, private router: Router) {
    store.subscribe(s => this.user = s.userState);
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
