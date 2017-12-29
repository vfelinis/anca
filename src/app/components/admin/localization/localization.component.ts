import { Component, OnInit, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { LocaleState, localeActionCreators } from '../../../store/Locale';
import { LocalizationService } from '../../../services/localization/localization.service';

@Component({
  selector: 'app-localization',
  templateUrl: './localization.component.html',
  styleUrls: ['./localization.component.less']
})
export class LocalizationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private locale: LocaleState;

  constructor(
    private localizationService: LocalizationService
  ) {
    this.localizationService.getLocale().takeUntil(this.ngUnsubscribe).subscribe(c => this.locale = c);
  }

  ngOnInit() {
    this.localizationService.fetchLocale();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
