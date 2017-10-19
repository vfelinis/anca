import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, UrlSegment} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../store';
import { ContentState, contentActionCreators } from '../../store/Content';
import { LocalizationService } from '../../services/localization/localization.service';
import { ContentService } from '../../services/content/content.service';
import { PageService } from '../../services/page/page.service';
import { Page } from '../../store/Pages';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
  providers: [LocalizationService, ContentService, PageService]
})
export class ContentComponent implements OnInit {
  private content: ContentState;
  private page: Page;
  private isEdit = false;
  constructor(
    private store: Store<ApplicationState>,
    private contentService: ContentService,
    private pageService: PageService,
    private localizationService: LocalizationService
  ) {
    store.subscribe(s => this.content = s.contentState);
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
