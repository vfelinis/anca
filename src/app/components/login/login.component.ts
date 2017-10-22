import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalizationService } from '../../services/localization/localization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [LocalizationService]
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  private password: FormControl = new FormControl('', [Validators.required]);
  private hide = true;
  constructor(
    private localizationService: LocalizationService
  ) {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  ngOnInit() {
  }

  getLocalizedString(key: string): string {
    return this.localizationService.getData(key);
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter a value' : '';
  }

  submit() {
    if (this.loginForm.status === 'VALID') {
      console.log(this.email.value);
    }
  }
}
