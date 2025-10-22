import type {ResultsActionType} from "./actions/resultsActions.ts";
import type {AuthActionType} from "./actions/authActions.ts";

export interface ResultItem {
    id: number;
    x: string;
    y: string;
    r: string;
    hit: boolean;
    formattedTimestamp: string;
    formattedExecutionTime: string;
}

export interface CoordinatesRequest {
    x: number;
    y: number;
    r: number;
    clientTimestamp: number;
    clientTimezone: string;
}

export interface AuthRequest {
    user: string,
    password: string
}

export interface RegisterRequest {
    user: string,
    password: string
}

export interface ResultsState {
    results: ResultItem[];
    totalPages: number,
    loading: boolean;
    page: number,
    error: string | null;
    r: number,
}


export interface AuthState {
    loginLoading: boolean;
    registerLoading: boolean;
    loginError: string | null;
    registerError: string | null;
    registerSuccess: boolean,
    authSuccess: boolean,
    authorized: boolean
}


export type AppAction = ResultsActionType | AuthActionType;

export interface RootState {
    results: ResultsState;
    auth: AuthState;
}