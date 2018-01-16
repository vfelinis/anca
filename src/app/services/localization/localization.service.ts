import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApplicationState } from '../../store';
import { LocaleState, localeActionCreators } from '../../store/Locale';
import { contentActionCreators } from '../../store/Content';
import { LastExecutionState, lastExecutionActionCreators } from '../../store/LastExecution';

@Injectable()
export class LocalizationService {
  private localeState: Observable<LocaleState>;
  constructor(
    private store: Store<ApplicationState>,
    private http: HttpClient,
    private router: Router
  ) {
    this.localeState = this.store.select(p => p.localeState);
  }

  getLocale(): Observable<LocaleState> {
    return this.localeState;
  }

  getLocalizedString(key: string): Observable<string> {
    return this.localeState.map(s => s.locales[s.currentLanguage][key]
      ? s.locales[s.currentLanguage][key]
      : `${key}^`);
  }

  getLocalizedStringFromReadyState(locale: LocaleState, key: string): string {
    if (!!locale) {
      return locale.locales[locale.currentLanguage][key]
        ? locale.locales[locale.currentLanguage][key]
        : `${key}^`;
    } else {
      return `${key}^`;
    }
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
    const stream = this.http.post(`api/locales`, body, { headers: headers });
    const create = (data: any): void => {
      this.store.dispatch(localeActionCreators.createResources(data));
      this.store.dispatch(lastExecutionActionCreators.cleanLastExecution());
    };
    const lastExecution: LastExecutionState = {
      stream: stream,
      returnUrl: this.router.url,
      callback: create
    };
    this.store.dispatch(lastExecutionActionCreators.setLastExecution(lastExecution));
    stream.subscribe((data: any) => {
      create(data);
    },
      (error: any) => console.log(error)
    );
  }

  updateResources(resources: any) {
    const body = JSON.stringify(resources);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    const stream = this.http.put(`api/locales`, body, { headers: headers });
    const update = (data: any): void => {
      this.store.dispatch(localeActionCreators.updateResources(data));
      this.store.dispatch(lastExecutionActionCreators.cleanLastExecution());
    };
    const lastExecution: LastExecutionState = {
      stream: stream,
      returnUrl: this.router.url,
      callback: update
    };
    this.store.dispatch(lastExecutionActionCreators.setLastExecution(lastExecution));
    stream.subscribe((data: any) => {
      update(data);
    },
      (error: any) => console.log(error)
    );
  }

  deleteResources(resourcesKey: string) {
    const stream = this.http.delete(`api/locales/?resourcesKey=${resourcesKey}`);
    const deleteAct = (data: any): void => {
      this.store.dispatch(localeActionCreators.deleteResources(data.resourcesKey));
    };
    const lastExecution: LastExecutionState = {
      stream: stream,
      returnUrl: this.router.url,
      callback: deleteAct
    };
    this.store.dispatch(lastExecutionActionCreators.setLastExecution(lastExecution));
    stream.subscribe((data: any) => {
      deleteAct(data);
    },
      (error: any) => console.log(error)
    );
  }
}
