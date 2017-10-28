import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../store';
import { Page } from '../../store/Pages';

@Injectable()
export class PageService {
  constructor(private store: Store<ApplicationState>) { }

  getPages(): Observable<Page[]> {
    return this.store.select(p => p.pagesState.pages);
  }

  getPageByCurrentRoute(): Observable<Page> {
    return this.store.select(s => s.pagesState.pages.find(p => p.pageUrl === s.routerState.state.url.substring(1)));
  }
}
