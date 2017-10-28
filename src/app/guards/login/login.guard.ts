import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store';
import { UserState } from '../../store/User';

@Injectable()
export class LoginGuard implements CanActivate {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private user: UserState;
  constructor(private store: Store<ApplicationState>, private router: Router) {
    store.takeUntil(this.ngUnsubscribe).subscribe(s => this.user = s.userState);
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
      if (!this.user) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
  }
}
