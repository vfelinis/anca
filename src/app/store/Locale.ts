import { Action, ActionReducer } from '@ngrx/store';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface LocaleState {
    currentLanguage: string;
    locales: any;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface SetLocaleAction {
    type: 'SET_LOCALE';
    payload: LocaleState;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SetLocaleAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const localeActionCreators = {
    setLocale: (localeState) => <SetLocaleAction>{ type: 'SET_LOCALE', payload: localeState },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: LocaleState = { currentLanguage: '',  locales: {}};

export function localeReducer(state: LocaleState, action: KnownAction): LocaleState {
    switch (action.type) {
        case 'SET_LOCALE':
            return action.payload;
        default:
            return state || unloadedState;
    }
};
