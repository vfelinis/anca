import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../store';
import { Page } from '../../store/Pages';
import { LocaleState } from '../../store/Locale';
import { LocalizationService } from '../../services/localization/localization.service';
import { PageService } from '../../services/page/page.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  providers: [LocalizationService, PageService]
})
export class NavComponent implements OnInit {
  private pages: Page[];
  constructor(
    private localizationService: LocalizationService,
    private pageService: PageService
  ) {
  }

  ngOnInit() {
    this.pages = this.pageService.getPages();
  }

  getLocalizedString(key: string): string {
    return this.localizationService.getData(key);
  }
}
