import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentComponent } from './components/content/content.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { ErrorComponent } from './components/error/error.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { ConfigurationComponent } from './components/admin/configuration/configuration.component';
import { PageManagementComponent } from './components/admin/page-management/page-management.component';
import { LocalizationComponent } from './components/admin/localization/localization.component';

import { LoginGuard } from './guards/login/login.guard';
import { AdminGuard } from './guards/admin/admin.guard';

import { ApplicationState, getInitialState } from './store/index';

const initialState = getInitialState();

const childRoutes: Routes = [
  { path: 'configuration', component: ConfigurationComponent},
  { path: 'pages', component: PageManagementComponent},
  { path: 'localization', component: LocalizationComponent}
];

const routes: Routes = [];

if (initialState && initialState.pageState && initialState.pageState.pages instanceof Array) {
  initialState.pageState.pages.sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach(p => routes.push({ path: p.url,  component: ContentComponent }));
}

routes.push({ path: 'login',  component: LoginComponent, canActivate: [LoginGuard] });
routes.push({ path: 'admin',  component: AdminComponent, children: childRoutes, canActivate: [AdminGuard] });
routes.push({ path: 'settings',  component: UserSettingsComponent });
routes.push({ path: '**', component: ErrorComponent });

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
