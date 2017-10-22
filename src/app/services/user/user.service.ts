import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Response } from '@angular/http';
import { ApplicationState } from '../../store';
import { UserState, userActionCreators } from '../../store/User';
import { setItem, getItem, removeItem } from '../../utils/localStorageUtil';

@Injectable()
export class UserService {
  public user$: Observable<UserState>;
  constructor(
    private store: Store<ApplicationState>,
    private http: Http
  ) {
    this.user$ = store.select(s => s.userState);
    this.getUserFromMemory();
  }

  getUserFromMemory() {
    const value = getItem('user');
    if (value) {
      const user: UserState = JSON.parse(value);
      this.store.dispatch(userActionCreators.setUser(user));
    }
  }

  setUserIntoMemory(user: UserState) {
    const value: string = JSON.stringify(user);
    setItem('user', value);
  }

  login() {
    this.http.get(`api/users`).subscribe((resp: Response) => {
      const user: UserState = resp.json();
      this.setUserIntoMemory(user);
      this.store.dispatch(userActionCreators.setUser(user));
    });
  }

  logout() {
    removeItem('user');
    this.store.dispatch(userActionCreators.clearUser());
  }
}
