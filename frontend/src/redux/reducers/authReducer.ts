import type {AuthState} from "../types.ts";
import type {AuthActionType} from "../actions/authActions.ts";

export const authInitialState: AuthState = {
    loginLoading: false,
    registerLoading: false,
    loginError: null,
    registerError: null,
    registerSuccess: false,
    authSuccess: false,
    authorized: false
};

export default function reducer(state: AuthState = authInitialState, action: AuthActionType): AuthState {
    switch (action.type) {
        case "AUTH_START_ACTION":
            return {
                ...state,
                loginLoading: true
            };
        case "AUTH_SUCCESS_ACTION":
            return {
                ...state,
                authSuccess: true,
                loginLoading: false
            };
        case "AUTH_FAIL_ACTION":
            return {
                ...state,
                authorized: false,
                loginLoading: false,
                loginError: action.payload
            };
        case "REGISTER_START_ACTION":
            return {
                ...state,
                registerLoading: true,
                registerSuccess: false
            };
        case "REGISTER_SUCCESS_ACTION":
            return {
                ...state,
                registerLoading: false,
                registerSuccess: true,
                registerError: null
            };
        case "REGISTER_FAIL_ACTION":
            return {
                ...state,
                registerLoading: false,
                registerSuccess: false,
                registerError: action.payload
            };
        case "REGISTER_SUCCESS_RESET":
            return {
                ...state,
                registerSuccess: false
            }
        case "RESET_REGISTER_SERVER_ERROR":
            return {
                ...state,
                registerError: null
            }
        case "RESET_AUTH_SUCCESS":
            return {
                ...state,
                authSuccess: false
            }
        case "SET_AUTHORIZED":
            return {
                ...state,
                authorized: action.payload
            }
        default:
            return state;
    }
}