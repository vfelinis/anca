import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

import { ContentState } from '../../store/Content';
import { Page } from '../../store/Pages';
import { UserState } from '../../store/User';

import { LocalizationService } from '../../services/localization/localization.service';
import { ContentService } from '../../services/content/content.service';
import { PageService } from '../../services/page/page.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
  providers: [LocalizationService, ContentService, PageService, UserService]
})
export class ContentComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private content: ContentState;
  private page: Page;
  private isEdit = false;
  constructor(
    private contentService: ContentService,
    private pageService: PageService,
    private localizationService: LocalizationService,
    private userService: UserService
  ) {
     contentService.getContent().takeUntil(this.ngUnsubscribe).subscribe(c => this.content = c);
     pageService.getPageByCurrentRoute().takeUntil(this.ngUnsubscribe).subscribe(p => this.page = p);
  }

  public options: Object = {
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    imageInsertButtons: ['imageBack', '|', 'imageByURL'],
    videoInsertButtons: ['videoBack', '|', 'videoByURL'],
    events : {
      'froalaEditor.file.beforeUpload' : function(e, editor, response) {
        alert('File upload is disabled');
        return false;
      }
    }
  };

  ngOnInit() {
    this.contentService.fetchContent(this.page.id);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getLocalizedString(key: string): Observable<string> {
    return this.localizationService.getLocalizedString(key);
  }

  editToogle() {
    this.isEdit = !this.isEdit;
  }

  hasEditingRight(): Observable<boolean> {
    return this.userService.isAdmin();
  }
}
