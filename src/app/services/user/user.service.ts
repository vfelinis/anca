import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { Response } from '@angular/http';
import { ApplicationState } from '../../store';
import { UserState, userActionCreators } from '../../store/User';
import { setItem, getItem, removeItem } from '../../utils/localStorageUtil';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
  constructor(
    private store: Store<ApplicationState>,
    private http: Http
  ) {
    this.getUserFromMemory();
  }

  getUser(): Observable<UserState> {
    return this.store.select(s => s.userState);
  }

  login(email: string, password: string, rememberMe: boolean) {
    const body = JSON.stringify({ email: email, password: password, rememberMe: rememberMe });
    const headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
    this.http.post(`api/account/login`, body, { headers: headers }).subscribe((resp: Response) => {
        const user: UserState = resp.json();
        this.store.dispatch(userActionCreators.setUser(user));
        if (rememberMe) {
          this.setUserIntoMemory(user);
        } else {
          this.clearUserFromMemory();
        }
      },
      (error: any) => console.log(error)
    );
  }

  logout() {
    this.store.dispatch(userActionCreators.clearUser());
    this.clearUserFromMemory();
  }

  isAdmin(): Observable<boolean> {
    return this.getUser().map(u => u.role.some(r => r === 'admin'));
  }

  private getUserFromMemory() {
    const value = getItem('user');
    if (value) {
      const user: UserState = JSON.parse(value);
      this.store.dispatch(userActionCreators.setUser(user));
    }
  }

  private setUserIntoMemory(user: UserState) {
    const value: string = JSON.stringify(user);
    setItem('user', value);
  }

  private clearUserFromMemory() {
    removeItem('user');
  }
}
