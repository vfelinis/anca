import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  private loginForm: FormGroup;
  private email: FormControl;
  private password: FormControl;
  private rememberMe: FormControl;
  private hide = true;
  constructor(
    private userService: UserService
  ) {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required]);
    this.rememberMe = new FormControl(false);
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    });
  }

  ngOnInit() {
  }

  getEmailErrorMessage() {
    return this.email.hasError('required')
            ? 'You must enter a value'
            : this.email.hasError('email')
              ? 'Not a valid email'
              : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'You must enter a value' : '';
  }

  submit() {
    if (this.loginForm.status === 'VALID') {
      this.userService.login(this.email.value, this.password.value, this.rememberMe.value);
    }
  }
}
