import { createStore, applyMiddleware, combineReducers } from 'redux';
import resultsReducer from './reducers/resultsReducer.ts';
import authReducer from './reducers/authReducer.ts';
import { thunk } from 'redux-thunk';
import type {AppAction, RootState} from "./types.ts";
import {resultsInitialState} from './reducers/resultsReducer.ts'
import {authInitialState} from './reducers/authReducer.ts'


const rootReducer = combineReducers({
    results: resultsReducer,
    auth: authReducer
    //...
}) as (state: RootState | undefined, action: AppAction) => RootState;

const preloadedState: RootState = {
    results: resultsInitialState,
    auth: authInitialState
};

const store= createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk)
);

export default store;