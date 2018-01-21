import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { CookieService, CookieOptions } from 'ngx-cookie';
import { SettingState } from '../../store/Setting';
import { SettingService } from '../../services/setting/setting.service';
import { LocalizationService } from '../../services/localization/localization.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.less']
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private currentLanguage: string;
  public settingsForm: FormGroup;
  public languages: FormControl;
  public settings: SettingState;
  constructor(
    private cookieService: CookieService,
    private settingService: SettingService,
    private localizationService: LocalizationService
  ) {
    this.settingService.getSettings().takeUntil(this.ngUnsubscribe).subscribe(s => this.settings = s);
    this.localizationService.getLocale().takeUntil(this.ngUnsubscribe).subscribe(s => this.currentLanguage = s.currentLanguage);
  }

  ngOnInit() {
    this.languages = new FormControl(this.currentLanguage);
    this.settingsForm = new FormGroup({
      languages: this.languages
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  notNeedSave() {
    return this.currentLanguage === this.languages.value;
  }

  submit() {
    if (this.settingsForm.status === 'VALID') {
      const exp = new Date();
      exp.setFullYear(exp.getFullYear() + 1);
      const cookieOptions = {expires: exp} as CookieOptions;
      this.cookieService.put(
        '.AspNetCore.Culture',
        `c=${this.languages.value}|uic=${this.languages.value}`,
        cookieOptions
      );
      this.localizationService.fetchLocale(true);
    }
  }
}
