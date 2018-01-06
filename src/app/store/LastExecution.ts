import { Action, ActionReducer } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

// Using if there was re-login to execute last request
export interface LastExecutionState {
    stream: Observable<Object>;
    returnUrl: string;
    callback(data: any): void;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface SetLastExecutionAction {
    type: 'SET_LAST_EXECUTION';
    payload: LastExecutionState;
}

interface CleanLastExecutionAction {
    type: 'CLEAN_LAST_EXECUTION';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SetLastExecutionAction | CleanLastExecutionAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const lastExecutionActionCreators = {
    setLastExecution: (state: LastExecutionState) => <SetLastExecutionAction>{ type: 'SET_LAST_EXECUTION', payload: state },
    cleanLastExecution: () => <CleanLastExecutionAction>{ type: 'CLEAN_LAST_EXECUTION' }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: LastExecutionState = null;

export function lastExecutionReducer(state: LastExecutionState, action: KnownAction): LastExecutionState {
    switch (action.type) {
        case 'SET_LAST_EXECUTION':
            return action.payload;
        case 'CLEAN_LAST_EXECUTION':
            return unloadedState;
        default:
            return state || unloadedState;
    }
}
