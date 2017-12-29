import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { CookieService, CookieOptions } from 'ngx-cookie';
import { SettingsState } from '../../store/Settings';
import { SettingsService } from '../../services/settings/settings.service';
import { LocalizationService } from '../../services/localization/localization.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.less']
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private settingsForm: FormGroup;
  private languages: FormControl;
  private settings: SettingsState;
  private currentLanguage = '';
  constructor(
    private cookieService: CookieService,
    private settingsService: SettingsService,
    private localizationService: LocalizationService
  ) {
    this.settingsService.getSettings().takeUntil(this.ngUnsubscribe).subscribe(s => this.settings = s);
  }

  ngOnInit() {
    const cookieCulture = this.cookieService.get('.AspNetCore.Culture');
    if (this.settings.languages.length === 1) {
      this.currentLanguage = this.settings.languages[0];
    } else if (!!cookieCulture) {
      const curLang = cookieCulture.substr(-2);
      this.currentLanguage = this.settings.languages.some(l => l === curLang) ? curLang : '';
    }
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
      this.currentLanguage = this.languages.value;
      this.localizationService.fetchLocale(true);
    }
  }
}
