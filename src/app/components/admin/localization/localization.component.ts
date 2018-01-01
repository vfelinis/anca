import { Component, OnInit, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { LocaleState, localeActionCreators } from '../../../store/Locale';
import { LocalizationService } from '../../../services/localization/localization.service';

interface Table {
  settings: any;
  source: Array<any>;
}

@Component({
  selector: 'app-localization',
  templateUrl: './localization.component.html',
  styleUrls: ['./localization.component.less']
})
export class LocalizationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private locale: LocaleState;
  private table: Table;
  constructor(
    private localizationService: LocalizationService
  ) {
    this.localizationService.getLocale().takeUntil(this.ngUnsubscribe).subscribe(c => this.locale = c);
    this.localizationService.getLocale().takeUntil(this.ngUnsubscribe)
      .map(c => {
        return {
          settings: this.getTableSettings(c.locales),
          source: this.getTableData(c.locales)
        };
      }).subscribe(c => this.table = c);
  }

  ngOnInit() {
    this.localizationService.fetchLocale();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getTableSettings(locales: any) {
    const settings = {
      add: {
        confirmCreate: true
      },
      edit: {
        confirmSave: true
      },
      delete: {
        confirmDelete: true
      },
      columns: {key: {title: 'key'}}
    };
    Object.keys(locales).forEach(p => settings.columns[p] = {title: p});
    return settings;
  }

  getTableData(locales: any): Array<any> {
    const source = [];
    const columns = [];
    let keys = [];
    Object.keys(locales).forEach(p => {
      columns.push(p);
      keys.push(...Object.keys(locales[p]));
    });
    keys = Array.from(new Set(keys));
    keys.forEach(k => {
      const row = {key: k};
      columns.forEach(c => {
        row[c] = locales[c][k];
      });
      source.push(row);
    });
    return source;
  }

  onCreateConfirm(event) {
    if (!!event.newData.key && this.table.source.some(s => s.key !==  event.newData.key)) {
      this.localizationService.createResources(event.newData);
    }
  }

  onUpdateConfirm(event) {
    let needSave = false;
    Object.keys(event.newData).forEach(k => {
      needSave = needSave || event.newData[k] !== event.data[k];
    });
    if (needSave) {
      event.newData['oldKey'] = event.data['key'];
      this.localizationService.updateResources(event.newData);
    }
  }

  onDeleteConfirm(event) {
    this.localizationService.deleteResources(event.data.key);
  }
}
