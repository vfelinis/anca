import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationState } from '../../store';
import { Page, pageActionCreators, UpdatedPage } from '../../store/Page';

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
    this.http.post(`api/pages`, body, { headers: headers }).subscribe((data: Page) => {
        this.store.dispatch(pageActionCreators.addPage(data));
        const routes = [...this.router.config];
        routes.splice(data.orderIndex, 0, { path: data.url,  component: this.router.config[0].component });
        this.router.resetConfig(routes);
      },
      (error: any) => console.log(error)
    );
  }

  update(updatedPage: UpdatedPage) {
    const body = JSON.stringify(updatedPage);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    this.http.put(`api/pages`, body, { headers: headers }).subscribe((data: Page) => {
        this.store.dispatch(pageActionCreators.updatePage(data));
        const routes = [...this.router.config.filter(r => r.path !== updatedPage.originalUrl)];
        routes.splice(data.orderIndex, 0, { path: data.url,  component: this.router.config[0].component });
        this.router.resetConfig(routes);
      },
      (error: any) => console.log(error)
    );
  }

  delete(pageId: number) {
    this.http.delete(`api/pages/?id=${pageId}`).subscribe((data: Page) => {
        this.store.dispatch(pageActionCreators.deletePage(data.id));
        const routes = [...this.router.config.filter(r => r.path !== data.url)];
        this.router.resetConfig(routes);
      },
      (error: any) => console.log(error)
    );
  }
}
