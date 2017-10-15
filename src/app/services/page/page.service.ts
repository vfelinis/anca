import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ApplicationState } from '../../store';
import { Page } from '../../store/Pages';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '../../utils/routerUtil';

@Injectable()
export class PageService {
  private pages: Page[];
  private route: RouterReducerState<RouterStateUrl>;
  constructor(private store: Store<ApplicationState>) {
    store.subscribe(s => {
      this.pages = s.pagesState.pages;
      this.route = s.routerState;
    });
  }
  getPages(): Page[] {
    return this.pages;
  }

  getPageByCurrentRoute(): Page {
    return this.pages.find(p => p.pageUrl === this.route.state.url.substring(1));
  }
}
