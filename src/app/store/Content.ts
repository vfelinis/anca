import { Action, ActionReducer } from '@ngrx/store';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ContentState {
    text: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface SetContentAction {
    type: 'SET_CONTENT';
    payload: ContentState;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SetContentAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const contentActionCreators = {
    setContent: (contentState: ContentState) => <SetContentAction>{ type: 'SET_CONTENT', payload: contentState }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: ContentState = { text: '' };

export function contentReducer(state: ContentState, action: KnownAction): ContentState {
    switch (action.type) {
        case 'SET_CONTENT':
            return action.payload;
        default:
            return state || unloadedState;
    }
};
