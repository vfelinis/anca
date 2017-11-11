import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatMenuModule, MatButtonModule, MatIconModule, MatCardModule,
  MatToolbarModule, MatDialogModule, MatFormFieldModule, MatInputModule,
  MatCheckboxModule, MatTabsModule, MatExpansionModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

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
import { AdminComponent } from './components/admin/admin.component';
import { PageManagementComponent } from './components/admin/page-management/page-management.component';
import { PageCreationComponent } from './components/admin/page-creation/page-creation.component';
import { ConfirmDialogComponent } from './components/common/confirm-dialog/confirm-dialog.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { LocalizeDirective } from './directives/localize/localize.directive';

import { LoginGuard } from './guards/login/login.guard';
import { AdminGuard } from './guards/admin/admin.guard';

import { environment } from '../environments/environment';

const initState = (window as any).initialReduxState as ApplicationState;

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ContentComponent,
    LoginComponent,
    AdminComponent,
    PageManagementComponent,
    PageCreationComponent,
    ConfirmDialogComponent,
    NotFoundComponent,
    LocalizeDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

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
    FlexLayoutModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers: [
    LoginGuard,
    AdminGuard,
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
  ],
  entryComponents: [
    PageCreationComponent,
    ConfirmDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}