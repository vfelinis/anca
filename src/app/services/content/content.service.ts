import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Response } from '@angular/http';
import { ApplicationState } from '../../store';
import { ContentState, contentActionCreators } from '../../store/Content';

@Injectable()
export class ContentService {
  public content$: Observable<ContentState>;
  constructor(
    private store: Store<ApplicationState>,
    private http: Http
  ) {
    this.content$ = store.select(s => s.contentState);
  }

  fetchContent(pageId: number) {
    this.http.get(`api/contents/?pageId=${ pageId }`).subscribe((resp: Response) => {
      const content = resp.json();
      this.store.dispatch(contentActionCreators.setContent(content));
    });
  }
}
