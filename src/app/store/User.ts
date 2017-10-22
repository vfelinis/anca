import { Action, ActionReducer } from '@ngrx/store';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface UserState {
    id: string;
    email: string;
    username: string;
    role: string;
    language: string;
    token: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface SetUserAction {
    type: 'SET_USER';
    payload: UserState;
}

interface ClearUserAction {
    type: 'CLEAR_USER';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SetUserAction | ClearUserAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const userActionCreators = {
    setUser: (user: UserState) => <SetUserAction>{ type: 'SET_USER', payload: user },
    clearUser: () => <ClearUserAction>{ type: 'CLEAR_USER' }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: UserState = null;

export function userReducer(state: UserState, action: KnownAction): UserState {
    switch (action.type) {
        case 'SET_USER':
            return action.payload;
        case 'CLEAR_USER':
            return unloadedState;
        default:
            return state || unloadedState;
    }
};
