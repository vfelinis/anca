import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationState } from '../../store';
import { Page, pageActionCreators, UpdatedPage } from '../../store/Page';
import { LastExecutionState, lastExecutionActionCreators } from '../../store/LastExecution';

@Injectable()
export class PageService {
  constructor(
    private store: Store<ApplicationState>,
    private http: HttpClient,
    private router: Router
  ) { }

  getPages(): Observable<Page[]> {
    return this.store.select(p => p.pageState.pages);
  }

  getPageByCurrentRoute(): Observable<Page> {
    return this.store.select(s => s.pageState.pages.find(p => p.url === s.routerState.state.url.substring(1)));
  }

  create(page: Page) {
    const body = JSON.stringify(page);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    const stream = this.http.post(`api/pages`, body, { headers: headers });
    const addPage = (data: Page): void => {
      this.store.dispatch(pageActionCreators.addPage(data));
      const routes = [...this.router.config];
      routes.splice(data.orderIndex, 0, { path: data.url, component: this.router.config[0].component });
      this.router.resetConfig(routes);
    };
    const lastExecution: LastExecutionState = {
      stream: stream,
      returnUrl: this.router.url,
      callback: addPage
    };
    this.store.dispatch(lastExecutionActionCreators.setLastExecution(lastExecution));
    stream.subscribe((data: Page) => {
      addPage(data);
    },
      (error: any) => console.log(error)
    );
  }

  update(updatedPage: UpdatedPage) {
    const body = JSON.stringify(updatedPage);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    const stream = this.http.put(`api/pages`, body, { headers: headers });
    const updatePage = (data: Page): void => {
      this.store.dispatch(pageActionCreators.updatePage(data));
      const routes = [...this.router.config.filter(r => r.path !== updatedPage.originalUrl)];
      routes.splice(data.orderIndex, 0, { path: data.url, component: this.router.config[0].component });
      this.router.resetConfig(routes);
    };
    const lastExecution: LastExecutionState = {
      stream: stream,
      returnUrl: this.router.url,
      callback: updatePage
    };
    this.store.dispatch(lastExecutionActionCreators.setLastExecution(lastExecution));
    stream.subscribe((data: Page) => {
      updatePage(data);
    },
      (error: any) => console.log(error)
    );
  }

  delete(pageId: number) {
    const stream = this.http.delete(`api/pages/?id=${pageId}`);
    const deletePage = (data: Page): void => {
      this.store.dispatch(pageActionCreators.deletePage(data.id));
      const routes = [...this.router.config.filter(r => r.path !== data.url)];
      this.router.resetConfig(routes);
    };
    const lastExecution: LastExecutionState = {
      stream: stream,
      returnUrl: this.router.url,
      callback: deletePage
    };
    this.store.dispatch(lastExecutionActionCreators.setLastExecution(lastExecution));
    stream.subscribe((data: Page) => {
      deletePage(data);
    },
      (error: any) => console.log(error)
    );
  }
}
