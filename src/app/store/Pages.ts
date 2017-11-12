import { Action, ActionReducer } from '@ngrx/store';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface PagesState {
    pages: Page[];
}

export interface Page {
    id: number;
    name: string;
    url: string;
    orderIndex: number;
    dateCreated: string;
    active: boolean;
}

export interface UpdatedPage extends Page {
    originalUrl: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface AddPagesAction {
    type: 'ADD_PAGE';
    payload: Page;
}

interface UpdatePagesAction {
    type: 'UPDATE_PAGE';
    payload: Page;
}

interface DeletePagesAction {
    type: 'DELETE_PAGE';
    payload: number;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = AddPagesAction | UpdatePagesAction | DeletePagesAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const pagesActionCreators = {
    addPage: (page: Page) => <AddPagesAction>{ type: 'ADD_PAGE', payload: page },
    updatePage: (page: Page) => <UpdatePagesAction>{ type: 'UPDATE_PAGE', payload: page },
    deletePage: (pageId: number) => <DeletePagesAction>{ type: 'DELETE_PAGE', payload: pageId },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: PagesState = { pages: [] };

export function pagesReducer(state: PagesState, action: KnownAction): PagesState {
    switch (action.type) {
        case 'ADD_PAGE':
            return {...state, pages: [...state.pages, action.payload]};
        case 'UPDATE_PAGE':
            return {...state, pages: [...state.pages.filter(p => p.id !== action.payload.id), action.payload]};
        case 'DELETE_PAGE':
            return {...state, pages: [...state.pages.filter(p => p.id !== action.payload)]};
        default:
            return state || unloadedState;
    }
};
