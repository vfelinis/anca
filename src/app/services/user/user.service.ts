import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import * as jwt_decode from 'jwt-decode';
import { ApplicationState } from '../../store';
import { UserState, userActionCreators } from '../../store/User';
import { LastExecutionState, lastExecutionActionCreators } from '../../store/LastExecution';
import { setItemLS, getItemLS, removeItemLS, setItemSS, getItemSS, removeItemSS } from '../../utils/localStorageUtil';
import 'rxjs/add/operator/map';

export const _jwt_decode = jwt_decode as any;

@Injectable()
export class UserService {
  constructor(
    private store: Store<ApplicationState>,
    private http: HttpClient,
    private router: Router
  ) {
    this.getUserFromMemory();
  }

  getUser(): Observable<UserState> {
    return this.store.select(s => s.userState);
  }

  getLastExecution(): Observable<LastExecutionState> {
    return this.store.select(s => s.lastExecutionState);
  }

  login(email: string, password: string, rememberMe: boolean, lastExecution: LastExecutionState) {
    const data = {
      grant_type: 'password',
      scope: 'openid email profile roles',
      username: email,
      password: password
    };
    const params = new URLSearchParams();
    Object.keys(data)
      .forEach(key => params.append(key, data[key]));
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    this.http.post('api/token', params.toString(), { headers: headers }).subscribe((res: any) => {
      const userData = _jwt_decode(res.id_token);
      const user: UserState = {
        email: userData.email,
        username: userData.name,
        role: Array.isArray(userData.role) ? userData.role : [userData.role],
        token: res.access_token
      };
      this.store.dispatch(userActionCreators.setUser(user));
      const userJSON = JSON.stringify(user);
      if (rememberMe) {
        removeItemSS('user');
        setItemLS('user', userJSON);
      } else {
        removeItemLS('user');
        setItemSS('user', userJSON);
      }
      if (!!lastExecution) {
        lastExecution.stream.subscribe((d: any) => {
          lastExecution.callback(d);
          this.store.dispatch(lastExecutionActionCreators.cleanLastExecution());
          this.router.navigate([lastExecution.returnUrl]);
        },
          (error: any) => {
            console.log(error);
            this.store.dispatch(lastExecutionActionCreators.cleanLastExecution());
            this.router.navigate(['/']);
          }
        );
      } else {
        this.router.navigate(['/']);
      }
    },
      (error: any) => console.log(error)
    );
  }

  logout() {
    this.clearUser();
    this.router.navigate(['/']);
  }

  unauthorized() {
    this.clearUser();
    this.router.navigate(['/login']);
  }

  isAdmin(): Observable<boolean> {
    return this.getUser().map(u => u.role.some(r => r === 'admin'));
  }

  private clearUser() {
    this.store.dispatch(userActionCreators.clearUser());
    removeItemSS('user');
    removeItemLS('user');
  }

  private getUserFromMemory() {
    let value = getItemSS('user');
    if (!value) {
      value = getItemLS('user');
    }
    if (value) {
      const user: UserState = JSON.parse(value);
      this.store.dispatch(userActionCreators.setUser(user));
    }
  }
}
