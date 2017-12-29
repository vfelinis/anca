import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationState } from '../../store';
import { LocaleState, localeActionCreators } from '../../store/Locale';

@Injectable()
export class LocalizationService {
  constructor(
    private store: Store<ApplicationState>,
    private http: HttpClient
  ) { }

  getLocale(): Observable<LocaleState> {
    return this.store.select(p => p.localeState);
  }

  getLocalizedString(key: string): Observable<string> {
    return this.store.select(s => s.localeState.locales[s.localeState.currentLanguage][key]
      ? s.localeState.locales[s.localeState.currentLanguage][key]
      : `${key}^`);
  }

  fetchLocale(onlyCurrentLanguage: boolean = false) {
    this.http.get(`api/locale/?onlyCurrentLanguage=${onlyCurrentLanguage}`).subscribe((data: LocaleState) => {
        this.store.dispatch(localeActionCreators.setLocale(data));
      },
      (error: any) => console.log(error)
    );
  }
}
