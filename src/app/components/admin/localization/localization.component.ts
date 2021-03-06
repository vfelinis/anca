import { Component, OnInit, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Subject } from 'rxjs/Subject';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { LocaleState, localeActionCreators } from '../../../store/Locale';
import { LocalizationService } from '../../../services/localization/localization.service';

@Component({
  selector: 'app-localization',
  templateUrl: './localization.component.html',
  styleUrls: ['./localization.component.less']
})
export class LocalizationComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private data: Array<any>;
  public settings: any;
  public source: LocalDataSource;
  constructor(
    private localizationService: LocalizationService
  ) {
    this.localizationService.getLocale().takeUntil(this.ngUnsubscribe)
      .subscribe(state => {
        const settings = {
          add: this.localizationService.getLocalizedStringFromReadyState(state, 'Add'),
          create: this.localizationService.getLocalizedStringFromReadyState(state, 'Create'),
          cancel: this.localizationService.getLocalizedStringFromReadyState(state, 'Cancel'),
          edit: this.localizationService.getLocalizedStringFromReadyState(state, 'Edit'),
          save: this.localizationService.getLocalizedStringFromReadyState(state, 'Save'),
          delete: this.localizationService.getLocalizedStringFromReadyState(state, 'Delete'),
          columnTitles: []
        };
        const keys = Object.keys(state.locales);
        keys.unshift('key');
        keys.forEach(k => {
          settings.columnTitles.push(
            { key: k, value: this.localizationService.getLocalizedStringFromReadyState(state, k) }
          );
        });
        this.settings = this.getTableSettings(settings);
        this.source = this.getTableData(state.locales);
      });
  }

  ngOnInit() {
    this.localizationService.fetchLocale();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getTableSettings(data: any) {
    const settings = {
      pager: {
        display: false
      },
      noDataMessage: '',
      actions: {
        columnTitle: ''
      },
      add: {
        addButtonContent: data.add,
        createButtonContent: data.create,
        cancelButtonContent: data.cancel,
        confirmCreate: true
      },
      edit: {
        editButtonContent: data.edit,
        saveButtonContent: data.save,
        cancelButtonContent: data.cancel,
        confirmSave: true
      },
      delete: {
        deleteButtonContent: data.delete,
        confirmDelete: true
      },
      columns: {}
    };
    data.columnTitles.forEach(p => settings.columns[p.key] = { title: p.value, filter: false });
    return settings;
  }

  getTableData(locales: any): LocalDataSource {
    this.data = [];
    const source = new LocalDataSource();
    const columns = [];
    let keys = [];
    Object.keys(locales).forEach(p => {
      columns.push(p);
      keys.push(...Object.keys(locales[p]));
    });
    keys = Array.from(new Set(keys));
    keys.forEach(k => {
      const row = { key: k };
      columns.forEach(c => {
        row[c] = locales[c][k];
      });
      source.add(row);
      this.data.push(row);
    });
    return source;
  }

  onCreateConfirm(event) {
    if (!!event.newData.key && !this.data.some(d => d.key === event.newData.key)) {
      this.localizationService.createResources(event.newData);
    }
  }

  onUpdateConfirm(event) {
    let needSave = false;
    Object.keys(event.newData).forEach(k => {
      needSave = needSave || event.newData[k] !== event.data[k];
    });
    needSave = needSave && this.data.filter(d => d.key === event.newData.key || d.key === event.data.key).length === 1;
    if (needSave) {
      event.newData['oldKey'] = event.data['key'];
      this.localizationService.updateResources(event.newData);
    }
  }

  onDeleteConfirm(event) {
    this.localizationService.deleteResources(event.data.key);
  }

  onSearch(query: string = '') {
    if (!!query) {
      this.source.getAll().then((data: Array<any>) => {
        if (data.length > 0) {
          this.source.setFilter(
            Object.keys(data[0]).map(k => Object.create({ field: k, search: query })),
            false
          );
        }
      });
    } else {
      this.source.reset();
    }
  }
}
