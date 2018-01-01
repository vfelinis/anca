import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationState } from '../../store';
import { SettingState, settingActionCreators } from '../../store/Setting';
import { LocalizationService } from '../localization/localization.service';

@Injectable()
export class SettingService {

  constructor(
    private store: Store<ApplicationState>,
    private http: HttpClient,
    private localizationService: LocalizationService
  ) { }

  getSettings(): Observable<SettingState> {
    return this.store.select(p => p.settingState);
  }

  update(settings: SettingState) {
    const body = JSON.stringify(settings);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    this.http.put(`api/settings`, body, { headers: headers }).subscribe((data: SettingState) => {
        this.store.dispatch(settingActionCreators.setSettings(data));
        this.localizationService.fetchLocale();
      },
      (error: any) => console.log(error)
    );
  }
}
