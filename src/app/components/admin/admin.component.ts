import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { ContentState } from '../../store/Content';
import { Page, UpdatedPage } from '../../store/Pages';
import { ContentService } from '../../services/content/content.service';
import { PageService } from '../../services/page/page.service';
import { UserService } from '../../services/user/user.service';
import { PageCreationComponent } from './page-creation/page-creation.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less'],
  providers: [ContentService, PageService, UserService]
})
export class AdminComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private pages: Page[];
  constructor(
    private dialog: MatDialog,
    private contentService: ContentService,
    private pageService: PageService,
    private userService: UserService
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
