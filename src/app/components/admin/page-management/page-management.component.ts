import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

import { Page } from '../../../store/Pages';

import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-page-management',
  templateUrl: './page-management.component.html',
  styleUrls: ['./page-management.component.less']
})
export class PageManagementComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Output() onSave = new EventEmitter<Page>();
  @Output() onDelete = new EventEmitter<number>();
  @Input() page = <Page>null;
  private pageName: FormControl;
  private pageUrl: FormControl;
  private pageOrderIndex: FormControl;
  private pageActive: FormControl;
  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.pageName = new FormControl(this.page.name, [Validators.required]);
    if (this.page.url === '') {
      this.pageUrl = new FormControl({value: '', disabled: true});
    } else {
      this.pageUrl = new FormControl(this.page.url, [Validators.pattern('[a-z0-9]+'), Validators.required]);
    }
    this.pageOrderIndex = new FormControl(this.page.orderIndex, [Validators.required]);
    this.pageActive = new FormControl(this.page.active);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getPageNameMessage() {
    return this.pageName.hasError('required') ? 'You must enter a value' : '';
  }

  getPageUrlMessage() {
    return this.pageUrl.hasError('pattern') || this.pageUrl.hasError('required')
            ? 'You must enter lowercase letters or numbers'
            : '';
  }

  getPageOrderIndexMessage() {
    return this.pageOrderIndex.hasError('required') ? 'You must enter a value' : '';
  }

  needSave() {
    return this.page.name === this.pageName.value
            && this.page.url === this.pageUrl.value
            && this.page.orderIndex === this.pageOrderIndex.value
            && this.page.active === this.pageActive.value;
  }

  save() {
    if (!this.pageName.invalid && !this.pageUrl.invalid && !this.pageOrderIndex.invalid) {
      const page: Page = {
        id: this.page.id,
        name: this.pageName.value,
        url: this.pageUrl.value,
        orderIndex: this.pageOrderIndex.value,
        dateCreated: this.page.dateCreated,
        active: this.pageActive.value
      };
      this.onSave.emit(page);
    }
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Delete the page ${this.page.name}`,
        content: 'Are you sure?'
      }
    });

    dialogRef.afterClosed().takeUntil(this.ngUnsubscribe).subscribe(confirm => {
      if (confirm) {
        this.onDelete.emit(this.page.id);
      }
    });
  }
}
