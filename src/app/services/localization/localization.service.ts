import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store';

@Injectable()
export class LocalizationService {
  constructor(private store: Store<ApplicationState>) { }
  getLocalizedString(key: string): Observable<string> {
    return this.store.select(s => s.localeState[key] ? s.localeState[key] : `${key}^`);
  }
}
