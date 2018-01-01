import { Action, ActionReducer } from '@ngrx/store';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface PageState {
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

interface AddPageAction {
    type: 'ADD_PAGE';
    payload: Page;
}

interface UpdatePageAction {
    type: 'UPDATE_PAGE';
    payload: Page;
}

interface DeletePageAction {
    type: 'DELETE_PAGE';
    payload: number;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = AddPageAction | UpdatePageAction | DeletePageAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const pageActionCreators = {
    addPage: (page: Page) => <AddPageAction>{ type: 'ADD_PAGE', payload: page },
    updatePage: (page: Page) => <UpdatePageAction>{ type: 'UPDATE_PAGE', payload: page },
    deletePage: (pageId: number) => <DeletePageAction>{ type: 'DELETE_PAGE', payload: pageId },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: PageState = { pages: [] };

export function pageReducer(state: PageState, action: KnownAction): PageState {
    switch (action.type) {
        case 'ADD_PAGE':
            return {pages: [...state.pages, action.payload].sort((a, b) => a.orderIndex - b.orderIndex)};
        case 'UPDATE_PAGE':
            return {pages: [
                ...state.pages.filter(p => p.id !== action.payload.id),
                action.payload
            ].sort((a, b) => a.orderIndex - b.orderIndex)};
        case 'DELETE_PAGE':
            return {pages: [...state.pages.filter(p => p.id !== action.payload)]};
        default:
            return state || unloadedState;
    }
}
