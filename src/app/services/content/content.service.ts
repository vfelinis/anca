import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApplicationState } from '../../store';
import { ContentState, contentActionCreators } from '../../store/Content';
import { LastExecutionState, lastExecutionActionCreators } from '../../store/LastExecution';

@Injectable()
export class ContentService {
  constructor(
    private store: Store<ApplicationState>,
    private http: HttpClient,
    private router: Router
  ) { }

  getContent(): Observable<ContentState> {
    return this.store.select(s => s.contentState);
  }

  fetchContent(pageId: number) {
    this.http.get(`api/contents/?pageId=${pageId}`).subscribe((data: ContentState) => {
      this.store.dispatch(contentActionCreators.setContent(data));
    },
      (error: any) => console.log(error)
    );
  }

  saveContent(content: ContentState) {
    const body = JSON.stringify(content);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    const stream = this.http.put('api/contents', body, { headers: headers });
    const setContent = (data: ContentState): void => {
      this.store.dispatch(contentActionCreators.setContent(data));
    };
    const lastExecution: LastExecutionState = {
      stream: stream,
      returnUrl: this.router.url,
      callback: setContent
    };
    this.store.dispatch(lastExecutionActionCreators.setLastExecution(lastExecution));
    stream.subscribe((data: ContentState) => {
      setContent(data);
    },
      (error: any) => console.log(error)
    );
  }
}
