import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../store';
import { Page } from '../../store/Pages';
import { LocaleState } from '../../store/Locale';
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
export class NavComponent implements OnInit {
  public user: UserState;
  private pages: Page[];
  constructor(
    private localizationService: LocalizationService,
    private pageService: PageService,
    private userService: UserService
  ) {
    userService.user$.subscribe(u => this.user = u);
  }

  ngOnInit() {
    this.pages = this.pageService.getPages();
  }

  getLocalizedString(key: string): string {
    return this.localizationService.getData(key);
  }
}
