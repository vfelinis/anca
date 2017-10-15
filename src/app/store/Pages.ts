import { Action, ActionReducer } from '@ngrx/store';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface PagesState {
    pages: Page[];
}

export interface Page extends BasePage {
    subPages: SubPage[];
}

export interface SubPage extends BasePage {

}

interface BasePage {
    id: number;
    pageName: string;
    pageUrl: string;
    orderIndex: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface RequestPagesAction {
    type: 'REQUEST_PAGES';
}

interface ReceivePagesAction {
    type: 'RECEIVE_PAGES';
    payload: Page[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestPagesAction | ReceivePagesAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const pagesActionCreators = {
    requestPages: () => <RequestPagesAction>{ type: 'REQUEST_PAGES' },
    receivePages: (pages) => <ReceivePagesAction>{ type: 'RECEIVE_PAGES', payload: pages },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: PagesState = { pages: [] };

export function pagesReducer(state: PagesState, action: KnownAction): PagesState {
    switch (action.type) {
        case 'RECEIVE_PAGES':
            return { pages: action.payload };
        default:
            return state || unloadedState;
    }
};
