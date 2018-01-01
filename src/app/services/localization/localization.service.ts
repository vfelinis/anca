import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationState } from '../../store';
import { LocaleState, localeActionCreators } from '../../store/Locale';
import { contentActionCreators } from '../../store/Content';

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
    this.http.get(`api/locales/?onlyCurrentLanguage=${onlyCurrentLanguage}`).subscribe((data: LocaleState) => {
        this.store.dispatch(localeActionCreators.setLocale(data));
        this.store.dispatch(contentActionCreators.cleanContent());
      },
      (error: any) => console.log(error)
    );
  }

  createResources(resources: any) {
    const body = JSON.stringify(resources);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    this.http.post(`api/locales`, body, { headers: headers }).subscribe((data: any) => {
        this.store.dispatch(localeActionCreators.createResources(data));
      },
      (error: any) => console.log(error)
    );
  }

  updateResources(resources: any) {
    const body = JSON.stringify(resources);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    this.http.put(`api/locales`, body, { headers: headers }).subscribe((data: any) => {
        this.store.dispatch(localeActionCreators.updateResources(data));
      },
      (error: any) => console.log(error)
    );
  }

  deleteResources(resourcesKey: string) {
    this.http.delete(`api/locales/?resourcesKey=${resourcesKey}`).subscribe((data: any) => {
        this.store.dispatch(localeActionCreators.deleteResources(data.resourcesKey));
      },
      (error: any) => console.log(error)
    );
  }
}
