import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationState } from '../../store';
import { SettingsState, settingsActionCreators } from '../../store/Settings';
import { LocalizationService } from '../localization/localization.service';

@Injectable()
export class SettingsService {

  constructor(
    private store: Store<ApplicationState>,
    private http: HttpClient,
    private localizationService: LocalizationService
  ) { }

  getSettings(): Observable<SettingsState> {
    return this.store.select(p => p.settingsState);
  }

  update(settings: SettingsState) {
    const body = JSON.stringify(settings);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    this.http.put(`api/settings`, body, { headers: headers }).subscribe((data: SettingsState) => {
        this.store.dispatch(settingsActionCreators.setSettings(data));
        this.localizationService.fetchLocale();
      },
      (error: any) => console.log(error)
    );
  }
}
