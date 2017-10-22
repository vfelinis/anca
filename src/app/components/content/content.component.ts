import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, UrlSegment} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../store';
import { ContentState, contentActionCreators } from '../../store/Content';
import { Page } from '../../store/Pages';

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
export class ContentComponent implements OnInit {
  private content: ContentState;
  private page: Page;
  private isEdit = false;
  constructor(
    private contentService: ContentService,
    private pageService: PageService,
    private localizationService: LocalizationService,
    private userService: UserService
  ) {
     contentService.content$.subscribe(c => this.content = c);
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
    this.page = this.pageService.getPageByCurrentRoute();
    this.contentService.fetchContent(this.page.id);
  }

  getLocalizedString(key: string): string {
    return this.localizationService.getData(key);
  }

  editToogle() {
    this.isEdit = !this.isEdit;
  }
}
