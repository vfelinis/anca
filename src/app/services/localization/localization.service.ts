import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../store';
import { LocaleState } from '../../store/Locale';

@Injectable()
export class LocalizationService {
  private locale: LocaleState;
  constructor(private store: Store<ApplicationState>) {
    store.subscribe(s => this.locale = s.localeState);
  }
  getData(key: string): string {
    return this.locale[key] ? this.locale[key] : `${key}^`;
  }
}
