import {
    ActionReducerMap,
    createSelector,
    createFeatureSelector,
    ActionReducer,
    MetaReducer,
  } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { RouterStateUrl } from '../utils/routerUtil';
import { contentReducer, ContentState } from './Content';
import { pagesReducer, PagesState } from './Pages';
import { localeReducer, LocaleState } from './Locale';
import { userReducer, UserState } from './User';
import { SettingsState, settingsReducer } from './Settings';

// The top-level state object
export interface ApplicationState {
    routerState: fromRouter.RouterReducerState<RouterStateUrl>;
    contentState: ContentState;
    pagesState: PagesState;
    localeState: LocaleState;
    userState: UserState;
    settingsState: SettingsState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers: ActionReducerMap<ApplicationState> = {
    routerState: fromRouter.routerReducer,
    contentState: contentReducer,
    pagesState: pagesReducer,
    localeState: localeReducer,
    userState: userReducer,
    settingsState: settingsReducer
};
