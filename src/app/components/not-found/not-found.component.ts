import { Component, OnInit } from '@angular/core';
import { LocalizationService } from '../../services/localization/localization.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.less'],
  providers: [LocalizationService]
})
export class NotFoundComponent implements OnInit {

  constructor(private localizationService: LocalizationService) { }

  ngOnInit() {
  }

  getLocalizedString(key: string): string {
    return this.localizationService.getData(key);
  }
}
