import { Directive, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { LocalizationService } from '../../services/localization/localization.service';

@Directive({
  selector: '[appLocalize]'
})
export class LocalizeDirective implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input('appLocalize') text: string;
  constructor(private elementRef: ElementRef, private localizationService: LocalizationService) {
  }

  ngOnInit() {
    this.localizationService.getLocalizedString(this.text)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(s => {
        this.elementRef.nativeElement.innerText = s;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
