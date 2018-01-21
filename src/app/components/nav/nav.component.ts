import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Page } from '../../store/Page';
import { UserState } from '../../store/User';
import { SettingState } from '../../store/Setting';
import { PageService } from '../../services/page/page.service';
import { UserService } from '../../services/user/user.service';
import { SettingService } from '../../services/setting/setting.service';
import { LocalizationService } from '../../services/localization/localization.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit, OnChanges, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private pages: Page[];
  private inactiveTooltipMessage: string;
  public user: UserState;
  public settings: SettingState;
  public isAdmin: boolean;
  constructor(
    private pageService: PageService,
    private userService: UserService,
    private settingsService: SettingService,
    private localizationService: LocalizationService
  ) {
    this.userService.getUser().takeUntil(this.ngUnsubscribe).subscribe(u => this.user = u);
    this.pageService.getPages().takeUntil(this.ngUnsubscribe).subscribe(p => this.pages = p);
    this.userService.isAdmin().takeUntil(this.ngUnsubscribe).subscribe(a => this.isAdmin = a);
    this.settingsService.getSettings().takeUntil(this.ngUnsubscribe).subscribe(s => this.settings = s);
    this.localizationService.getLocalizedString('Inactive').takeUntil(this.ngUnsubscribe)
      .subscribe(s => this.inactiveTooltipMessage = s);
  }

  get Pages(): Page[] {
    return this.pages.filter(m => m.active || this.user.role.some(r => r === 'admin'));
  }

  ngOnInit() {
    document.querySelector('title').innerText = this.settings.companyName;
  }

  ngOnChanges() { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  logout() {
    this.userService.logout();
  }

  showSettings(): boolean {
    return this.settings.languages.length > 1;
  }
}
