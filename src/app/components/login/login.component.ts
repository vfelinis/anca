import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../../services/user/user.service';
import { LastExecutionState } from '../../store/LastExecution';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private lastExecution: LastExecutionState;
  private loginForm: FormGroup;
  private email: FormControl;
  private password: FormControl;
  private rememberMe: FormControl;
  private hide = true;
  constructor(
    private userService: UserService
  ) {
    this.userService.getLastExecution().takeUntil(this.ngUnsubscribe).subscribe(l => this.lastExecution = l);
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      this.userService.login(this.email.value, this.password.value, this.rememberMe.value, this.lastExecution);
    }
  }
}
