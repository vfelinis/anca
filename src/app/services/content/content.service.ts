import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationState } from '../../store';
import { ContentState, contentActionCreators } from '../../store/Content';

@Injectable()
export class ContentService {
  constructor(
    private store: Store<ApplicationState>,
    private http: HttpClient
  ) { }

  getContent(): Observable<ContentState> {
    return this.store.select(s => s.contentState);
  }

  fetchContent(pageId: number) {
    this.http.get(`api/contents/?pageId=${ pageId }`).subscribe((data: ContentState) => {
        this.store.dispatch(contentActionCreators.setContent(data));
      },
      (error: any) => console.log(error)
    );
  }

  saveContent(content: ContentState) {
    const body = JSON.stringify(content);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' });
    this.http.put('api/contents', body, { headers: headers }).subscribe((data: ContentState) => {
        this.store.dispatch(contentActionCreators.setContent(data));
      },
      (error: any) => console.log(error)
    );
  }
}
