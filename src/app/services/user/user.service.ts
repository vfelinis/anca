import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationState } from '../../store';
import { UserState, userActionCreators } from '../../store/User';
import { setItemLS, getItemLS, removeItemLS, setItemSS, getItemSS, removeItemSS } from '../../utils/localStorageUtil';
import 'rxjs/add/operator/map';

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

  login(email: string, password: string, rememberMe: boolean) {
    const body = JSON.stringify({ email: email, password: password, rememberMe: rememberMe });
    const headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' });
    this.http.post(`api/account/login`, body, { headers: headers }).subscribe((user: UserState) => {
        this.store.dispatch(userActionCreators.setUser(user));
        const userJSON = JSON.stringify(user);
        if (rememberMe) {
          removeItemSS('user');
          setItemLS('user', userJSON);
        } else {
          removeItemLS('user');
          setItemSS('user', userJSON);
        }
        this.router.navigate(['']);
      },
      (error: any) => console.log(error)
    );
  }

  logout() {
    this.store.dispatch(userActionCreators.clearUser());
    removeItemSS('user');
    removeItemLS('user');
    this.router.navigate(['']);
  }

  isAdmin(): Observable<boolean> {
    return this.getUser().map(u => u.role.some(r => r === 'admin'));
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
