import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';

import { MatMenuModule, MatButtonModule, MatIconModule, MatCardModule,
  MatToolbarModule, MatDialogModule, MatFormFieldModule, MatInputModule,
  MatCheckboxModule, MatTabsModule, MatExpansionModule, MatSelectModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { StoreModule } from '@ngrx/store';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer,
} from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, ApplicationState } from './store';
import { CustomRouterStateSerializer } from './utils/routerUtil';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { ContentComponent } from './components/content/content.component';
import { LoginComponent } from './components/login/login.component';
import { ConfirmDialogComponent } from './components/common/confirm-dialog/confirm-dialog.component';
import { ErrorComponent } from './components/error/error.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

import { AdminComponent } from './components/admin/admin.component';
import { PageManagementComponent } from './components/admin/page-management/page-management.component';
import { PageManagementItemComponent } from './components/admin/page-management/page-management-item/page-management-item.component';
import { PageCreationComponent } from './components/admin/page-creation/page-creation.component';
import { ConfigurationComponent } from './components/admin/configuration/configuration.component';
import { LocalizationComponent } from './components/admin/localization/localization.component';

import { LocalizeDirective } from './directives/localize/localize.directive';

import { LoginGuard } from './guards/login/login.guard';
import { AdminGuard } from './guards/admin/admin.guard';

import { environment } from '../environments/environment';
import { AuthHttpInterceptor } from './interceptors/authHttpInterceptor';
import { UserService } from './services/user/user.service';
import { LocalizationService } from './services/localization/localization.service';
import { ContentService } from './services/content/content.service';
import { PageService } from './services/page/page.service';
import { SettingService } from './services/setting/setting.service';

const initState = (window as any).initialReduxState as ApplicationState;

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ContentComponent,
    LoginComponent,
    AdminComponent,
    PageManagementComponent,
    PageManagementItemComponent,
    PageCreationComponent,
    ConfirmDialogComponent,
    ErrorComponent,
    UserSettingsComponent,
    LocalizeDirective,
    ConfigurationComponent,
    LocalizationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CookieModule.forRoot(),

    StoreModule.forRoot(reducers, {initialState: initState}),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,
    FlexLayoutModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    Ng2SmartTableModule
  ],
  providers: [
    LocalizationService,
    UserService,
    ContentService,
    PageService,
    SettingService,
    LoginGuard,
    AdminGuard,
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    PageCreationComponent,
    ConfirmDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}