import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApplicationState } from '../../store';
import { SettingState, settingActionCreators } from '../../store/Setting';
import { LocalizationService } from '../localization/localization.service';
import { LastExecutionState, lastExecutionActionCreators } from '../../store/LastExecution';

@Injectable()
export class SettingService {

  constructor(
    private store: Store<ApplicationState>,
    private http: HttpClient,
    private localizationService: LocalizationService,
    private router: Router
  ) { }

  getSettings(): Observable<SettingState> {
    return this.store.select(p => p.settingState);
  }

  update(setting: SettingState) {
    const body = JSON.stringify(setting);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    const stream = this.http.put(`api/settings`, body, { headers: headers });
    const setSettings = (data: SettingState): void => {
      this.store.dispatch(settingActionCreators.setSettings(data));
      this.localizationService.fetchLocale();
    };
    const lastExecution: LastExecutionState = {
      stream: stream,
      returnUrl: this.router.url,
      callback: setSettings
    };
    this.store.dispatch(lastExecutionActionCreators.setLastExecution(lastExecution));
    stream.subscribe((data: SettingState) => {
      setSettings(data);
    },
      (error: any) => console.log(error)
    );
  }
}
