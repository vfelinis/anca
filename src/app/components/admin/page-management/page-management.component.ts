import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { Page, UpdatedPage } from '../../../store/Page';
import { PageService } from '../../../services/page/page.service';
import { PageCreationComponent } from '../page-creation/page-creation.component';

@Component({
  selector: 'app-page-management',
  templateUrl: './page-management.component.html',
  styleUrls: ['./page-management.component.less']
})
export class PageManagementComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public pages: Page[];
  constructor(
    private dialog: MatDialog,
    private pageService: PageService
  ) {
    this.pageService.getPages().takeUntil(this.ngUnsubscribe).subscribe(p => this.pages = p);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onCreate() {
    this.dialog.open(PageCreationComponent);
  }

  onSave(updatedPage: UpdatedPage) {
    this.pageService.update(updatedPage);
  }

  onDelete(pageId: number) {
    this.pageService.delete(pageId);
  }
}
