import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentComponent } from './components/content/content.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { LoginGuard } from './guards/login/login.guard';
import { AdminGuard } from './guards/admin/admin.guard';

import { ApplicationState } from './store/index';

const initState = (window as any).initialReduxState as ApplicationState;

const routes: Routes = [];

if (initState && initState.pagesState && initState.pagesState.pages instanceof Array) {
  initState.pagesState.pages.forEach(p => routes.push({ path: p.url,  component: ContentComponent }));
}

routes.push({ path: 'login',  component: LoginComponent, canActivate: [LoginGuard] });
routes.push({ path: 'admin',  component: AdminComponent, canActivate: [AdminGuard] });
routes.push({ path: '**', component: NotFoundComponent });

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }