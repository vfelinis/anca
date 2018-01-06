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
  private logo: FormControl;
  private companyName: FormControl;
  private languages: FormControl;
  private settings: SettingState;
  private newLogo: string;
  constructor(
    private cookieService: CookieService,
    private settingsService: SettingService
  ) {
    this.settingsService.getSettings().takeUntil(this.ngUnsubscribe).subscribe(s => this.settings = s);
  }

  ngOnInit() {
    this.logo = new FormControl({ value: '', disabled: true });
    this.companyName = new FormControl(this.settings.companyName, [Validators.required]);
    this.languages = new FormControl(this.settings.languages, [Validators.required]);
    this.configForm = new FormGroup({
      logo: this.logo,
      companyName: this.companyName,
      languages: this.languages
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onFileInput(event: any) {
    if (!!event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      const image = new Image();
      const MAX_SIZE = 50;
      reader.onloadend = function () {
        image.onload = function () {
          const canvas = document.createElement('canvas');
          if (image.width > image.height) {
            if (image.width > MAX_SIZE) {
              image.height *= MAX_SIZE / image.width;
              image.width = MAX_SIZE;
            }
          } else {
            if (image.height > MAX_SIZE) {
              image.width *= MAX_SIZE / image.height;
              image.height = MAX_SIZE;
            }
          }
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0, image.width, image.height);
          this.newLogo = canvas.toDataURL('image/png');
          this.logo.setValue(file.name);
        }.bind(this);
        image.src = reader.result;
      }.bind(this);
      reader.readAsDataURL(file);
    } else {
      this.logo.setValue('');
      this.newLogo = '';
    }
  }

  getCompanyNameMessage() {
    return this.companyName.hasError('required') ? 'You must enter a value' : '';
  }

  getLanguagesMessage() {
    return this.languages.hasError('required') ? 'You must enter a value' : '';
  }

  notNeedSave() {
    return !this.logo.value
      && this.settings.companyName === this.companyName.value
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
        logo: !!this.newLogo ? this.newLogo : this.settings.logo,
        languages: this.languages.value,
        supportedLanguages: this.settings.supportedLanguages
      };
      this.settingsService.update(updatedSettings);
      this.logo.setValue('');
      this.newLogo = '';
    }
  }
}
