import type {Dispatch} from "redux";
import type {AppAction, AuthRequest, RegisterRequest} from "../types.ts";
import {SERVER_URL} from "../../config.ts";

export interface AuthStartAction {
    type: 'AUTH_START_ACTION';
    payload: null;
}

export interface AuthSuccessAction {
    type: 'AUTH_SUCCESS_ACTION';
    payload: string;
}

export interface AuthFailAction {
    type: 'AUTH_FAIL_ACTION';
    payload: string;
}

export interface RegisterStartAction {
    type: 'REGISTER_START_ACTION';
    payload: null;
}

export interface RegisterSuccessAction {
    type: 'REGISTER_SUCCESS_ACTION';
    payload: null;
}

export interface RegisterFailAction {
    type: 'REGISTER_FAIL_ACTION';
    payload: string;
}

export interface ResetRegisterSuccess {
    type: 'REGISTER_SUCCESS_RESET';
    payload: null;
}

export interface ResetRegisterServerErrorAction {
    type: 'RESET_REGISTER_SERVER_ERROR';
    payload: null;
}

export interface ResetAuthSuccessAction {
    type: 'RESET_AUTH_SUCCESS';
    payload: null;
}

export interface SetAuthorizedAction {
    type: 'SET_AUTHORIZED';
    payload: boolean;
}





export type AuthActionType = AuthStartAction | AuthSuccessAction | AuthFailAction |
    RegisterStartAction | RegisterSuccessAction | RegisterFailAction | ResetRegisterSuccess | ResetRegisterServerErrorAction |
    ResetAuthSuccessAction | SetAuthorizedAction;

export const createSetAuthorizedAction = (value: boolean): SetAuthorizedAction => ({
    type: 'SET_AUTHORIZED',
    payload: value
});

export const createAuthStart = (): AuthStartAction => ({
    type: 'AUTH_START_ACTION',
    payload: null
});

export const createAuthSuccess = (token: string): AuthSuccessAction => ({
    type: 'AUTH_SUCCESS_ACTION',
    payload: token
});

export const createAuthFail = (error: string): AuthFailAction => ({
    type: 'AUTH_FAIL_ACTION',
    payload: error
});

export const createRegisterStart = (): RegisterStartAction => ({
    type: 'REGISTER_START_ACTION',
    payload: null
});

export const createRegisterSuccess = (): RegisterSuccessAction => ({
    type: 'REGISTER_SUCCESS_ACTION',
    payload: null
});

export const createRegisterSuccessReset = (): ResetRegisterSuccess => ({
    type: 'REGISTER_SUCCESS_RESET',
    payload: null
});

export const createResetRegisterServerError = (): ResetRegisterServerErrorAction => ({
    type: 'RESET_REGISTER_SERVER_ERROR',
    payload: null
});

export const createResetAuthSuccess = (): ResetAuthSuccessAction => ({
    type: 'RESET_AUTH_SUCCESS',
    payload: null
});


export const createRegisterFail = (error: string): RegisterFailAction => ({
    type: 'REGISTER_FAIL_ACTION',
    payload: error
});



export const authThunk = (authRequest: AuthRequest) => {
    return (dispatch: Dispatch<AppAction>) => {
        dispatch(createAuthStart());
        fetch(`${SERVER_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(authRequest)
        })
            .then(response => {
                return response.json();
            })
            .then((response: {token: string, error: string}) => {
                if(response.error) {
                    throw new Error(response.error);
                }
                localStorage.setItem("token", response.token)
                dispatch(createAuthSuccess(response.token));
            })
            .catch(error => {
                if(error instanceof TypeError) {
                    dispatch(createAuthFail("Сервер недоступен. Попробуйте позже."));
                    return;
                }
                dispatch(createAuthFail(error.message));
            });
    };
};

export const registerThunk = (registerRequest: RegisterRequest) => {
    return (dispatch: Dispatch<AppAction>) => {
        dispatch(createRegisterStart());
        fetch(`${SERVER_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerRequest)
        })
            .then(response => {
                if(response.ok) {
                    dispatch(createRegisterSuccess());
                    return;
                }
                return response.json();
            })
            .then((response: {error: string}) => {
                if(response && response.error) {
                    throw new Error(response.error);
                }
                dispatch(createRegisterSuccess());
            })
            .catch(error => {
                if(error instanceof TypeError) {
                    dispatch(createRegisterFail("Сервер недоступен. Попробуйте позже."));
                    return;
                }
                dispatch(createRegisterFail(error.message));
            });
    };
};