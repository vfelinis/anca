import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentComponent } from './components/content/content.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { ErrorComponent } from './components/error/error.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

import { LoginGuard } from './guards/login/login.guard';
import { AdminGuard } from './guards/admin/admin.guard';

import { ApplicationState } from './store/index';

const initState = (window as any).initialReduxState as ApplicationState;

const routes: Routes = [];

if (initState && initState.pageState && initState.pageState.pages instanceof Array) {
  initState.pageState.pages.sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach(p => routes.push({ path: p.url,  component: ContentComponent }));
}

routes.push({ path: 'login',  component: LoginComponent, canActivate: [LoginGuard] });
routes.push({ path: 'admin',  component: AdminComponent, canActivate: [AdminGuard] });
routes.push({ path: 'settings',  component: UserSettingsComponent });
routes.push({ path: '**', component: ErrorComponent });

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }