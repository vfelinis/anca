import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

import { Page } from '../../store/Pages';
import { UserState } from '../../store/User';

import { LocalizationService } from '../../services/localization/localization.service';
import { PageService } from '../../services/page/page.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  providers: [LocalizationService, PageService, UserService]
})
export class NavComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public user: UserState;
  private pages: Page[];
  constructor(
    private localizationService: LocalizationService,
    private pageService: PageService,
    private userService: UserService
  ) {
    userService.getUser().takeUntil(this.ngUnsubscribe).subscribe(u => this.user = u);
    pageService.getPages().takeUntil(this.ngUnsubscribe).subscribe(p => this.pages = p);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getLocalizedString(key: string): Observable<string> {
    return this.localizationService.getLocalizedString(key);
  }

  logout() {
    this.userService.logout();
  }
}
