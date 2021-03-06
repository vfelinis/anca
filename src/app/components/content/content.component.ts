import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { ContentState } from '../../store/Content';
import { Page } from '../../store/Page';
import { ContentService } from '../../services/content/content.service';
import { PageService } from '../../services/page/page.service';
import { UserService } from '../../services/user/user.service';
import { LocalizationService } from '../../services/localization/localization.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private content: ContentState;
  private currentLanguage: string;
  private editableText: string;
  private isEdit = false;
  public page: Page;
  public isAdmin: boolean;
  constructor(
    private contentService: ContentService,
    private pageService: PageService,
    private userService: UserService,
    private localizationService: LocalizationService
  ) {
    this.contentService.getContent().takeUntil(this.ngUnsubscribe).subscribe(c => this.content = c);
    this.localizationService.getLocale().takeUntil(this.ngUnsubscribe).subscribe(s => this.currentLanguage = s.currentLanguage);
    this.pageService.getPageByCurrentRoute().takeUntil(this.ngUnsubscribe).subscribe(p => this.page = p);
    this.userService.isAdmin().takeUntil(this.ngUnsubscribe).subscribe(a => this.isAdmin = a);
  }

  get Options(): Object {
    return {
      charCounterCount: false,
      imageInsertButtons: ['imageBack', '|', 'imageByURL'],
      videoInsertButtons: ['videoBack', '|', 'videoByURL'],
      events: {
        'froalaEditor.file.beforeUpload': function (e, editor, response) {
          alert('File upload is disabled');
          return false;
        }
      },
      language: this.currentLanguage
    };
  }

  ngOnInit() {
    this.contentService.fetchContent(this.page.id);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onEdit() {
    this.isEdit = true;
    this.editableText = this.content.text;
  }

  cancelEdit() {
    this.isEdit = false;
  }

  saveChanges() {
    if (this.content.text !== this.editableText) {
      this.contentService.saveContent({ id: this.content.id, text: this.editableText });
    }
    this.isEdit = false;
  }
}
