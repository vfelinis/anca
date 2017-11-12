import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationState } from '../../store';
import { Page, pagesActionCreators, UpdatedPage } from '../../store/Pages';

@Injectable()
export class PageService {
  constructor(
    private store: Store<ApplicationState>,
    private http: HttpClient,
    private router: Router
  ) { }

  getPages(): Observable<Page[]> {
    return this.store.select(p => p.pagesState.pages);
  }

  getPageByCurrentRoute(): Observable<Page> {
    return this.store.select(s => s.pagesState.pages.find(p => p.url === s.routerState.state.url.substring(1)));
  }

  create(page: Page) {
    const body = JSON.stringify(page);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8'
    });
    this.http.post(`api/pages`, body, { headers: headers }).subscribe((data: Page) => {
        this.store.dispatch(pagesActionCreators.addPage(data));
        const routes = [
          { path: data.url,  component: this.router.config[0].component },
          ...this.router.config
        ];
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
        this.store.dispatch(pagesActionCreators.updatePage(data));
        const routes = [
          { path: data.url,  component: this.router.config[0].component },
          ...this.router.config.filter(r => r.path !== updatedPage.originalUrl)
        ];
        this.router.resetConfig(routes);
      },
      (error: any) => console.log(error)
    );
  }

  delete(pageId: number) {
    this.http.delete(`api/pages/?id=${pageId}`).subscribe((data: Page) => {
        this.store.dispatch(pagesActionCreators.deletePage(data.id));
        const routes = [
          ...this.router.config.filter(r => r.path !== data.url)
        ];
        this.router.resetConfig(routes);
      },
      (error: any) => console.log(error)
    );
  }
}
