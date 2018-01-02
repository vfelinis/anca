import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { CookieService, CookieOptions } from 'ngx-cookie';
import { SettingState } from '../../../store/Setting';
import { SettingService } from '../../../services/setting/setting.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.less']
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private configForm: FormGroup;
  private companyName: FormControl;
  private languages: FormControl;
  private settings: SettingState;
  constructor(
    private cookieService: CookieService,
    private settingsService: SettingService
  ) {
    this.settingsService.getSettings().takeUntil(this.ngUnsubscribe).subscribe(s => this.settings = s);
  }

  ngOnInit() {
    this.companyName = new FormControl(this.settings.companyName, [Validators.required]);
    this.languages = new FormControl(this.settings.languages, [Validators.required]);
    this.configForm = new FormGroup({
      companyName: this.companyName,
      languages: this.languages
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getCompanyNameMessage() {
    return this.companyName.hasError('required') ? 'You must enter a value' : '';
  }

  getLanguagesMessage() {
    return this.languages.hasError('required') ? 'You must enter a value' : '';
  }

  notNeedSave() {
    return this.settings.companyName === this.companyName.value
            && this.settings.languages.length === this.languages.value.length
            && this.settings.languages.every(l => this.languages.value.some(v => v === l));
  }

  submit() {
    console.log(this.languages.value);
    if (this.configForm.status === 'VALID') {
      const updatedSettings: SettingState = {
        id: this.settings.id,
        companyName: this.companyName.value,
        defaultLanguage: this.settings.defaultLanguage,
        languages: this.languages.value,
        supportedLanguages: this.settings.supportedLanguages
      };
      this.settingsService.update(updatedSettings);
    }
  }
}
