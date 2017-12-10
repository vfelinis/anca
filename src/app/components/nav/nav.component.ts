import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { Page } from '../../store/Pages';
import { UserState } from '../../store/User';
import { SettingsState } from '../../store/Settings';
import { PageService } from '../../services/page/page.service';
import { UserService } from '../../services/user/user.service';
import { SettingsService } from '../../services/settings/settings.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public user: UserState;
  private settings: SettingsState;
  private pages: Page[];
  private isAdmin: boolean;
  constructor(
    private pageService: PageService,
    private userService: UserService,
    private settingsService: SettingsService
  ) {
    this.userService.getUser().takeUntil(this.ngUnsubscribe).subscribe(u => this.user = u);
    this.pageService.getPages().takeUntil(this.ngUnsubscribe).subscribe(p => this.pages = p);
    this.userService.isAdmin().takeUntil(this.ngUnsubscribe).subscribe(a => this.isAdmin = a);
    this.settingsService.getSettings().takeUntil(this.ngUnsubscribe).subscribe(s => this.settings = s);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  logout() {
    this.userService.logout();
  }
}
