import type {
    ResultItem,
    CoordinatesRequest, AppAction
} from '../types.ts';
import { SERVER_URL } from '../../config.ts';
import type { Dispatch } from 'redux';
import store from "../store.ts";


export interface GetResultsSuccessAction {
    type: 'GET_RESULTS_ACTION';
    payload: {
        results: ResultItem[],
        totalPages: number
    };
}

export interface GetResultsFailAction {
    type: 'GET_RESULTS_FAIL_ACTION';
    payload: string;
}

export interface ResultRequestStartAction {
    type: 'RESULT_REQUEST_START_ACTION';
    payload: null;
}

export interface ResultRequestFailAction {
    type: 'RESULT_REQUEST_FAIL_ACTION';
    payload: string;
}

export interface DeleteResultSuccessAction {
    type: 'DELETE_RESULT_SUCCESS';
    payload: number;
}

export interface AddResultSuccessAction {
    type: 'ADD_RESULT_SUCCESS_ACTION';
    payload: ResultItem;
}

export interface ChangeRAction {
    type: 'CHANGE_R';
    payload: number;
}


export interface ResetErrorAction {
    type: 'RESET_ERROR_ACTION';
    payload: null;
}

export interface SetPage {
    type: 'SET_PAGE';
    payload: number;
}

export interface SetTotalPages {
    type: 'SET_TOTAL_PAGES';
    payload: number;
}


export type ResultsActionType = GetResultsSuccessAction
    | GetResultsFailAction
    | ResultRequestStartAction
    | ResultRequestFailAction
    | AddResultSuccessAction
    | ChangeRAction
    | DeleteResultSuccessAction
    | ResetErrorAction | SetPage | SetTotalPages;

export const createGetResultsSuccess = (results: {results: ResultItem[], totalPages: number}): GetResultsSuccessAction => ({
    type: 'GET_RESULTS_ACTION',
    payload: results
});

export const createGetResultsFail = (error: string): GetResultsFailAction => ({
    type: 'GET_RESULTS_FAIL_ACTION',
    payload: error
});

export const createAddResultSuccess = (result: ResultItem): AddResultSuccessAction => ({
    type: 'ADD_RESULT_SUCCESS_ACTION',
    payload: result
});

export const createStartLoading = (): ResultRequestStartAction => ({
    type: 'RESULT_REQUEST_START_ACTION',
    payload: null
});

export const createDeleteResultSuccess = (id: number): DeleteResultSuccessAction => ({
    type: 'DELETE_RESULT_SUCCESS',
    payload: id
});

export const createResultRequestFail = (message: string): ResultRequestFailAction => ({
    type: 'RESULT_REQUEST_FAIL_ACTION',
    payload: message
});

export const setPage = (page: number): SetPage => ({
    type: 'SET_PAGE',
    payload: page
});

export const setTotalPages = (pages: number): SetTotalPages => ({
    type: 'SET_TOTAL_PAGES',
    payload: pages
});

export const createErrorResetAction = (): ResetErrorAction => ({
    type: 'RESET_ERROR_ACTION',
    payload: null
})

export const changeR = (r: number): ChangeRAction => ({
    type: 'CHANGE_R',
    payload: r
})


export const getResultsThunk = (page: number, pageSize: number, onSuccess: () => void = () => {}) => {
    return (dispatch: Dispatch<AppAction>) => {
        dispatch(createStartLoading())
        fetch(`${SERVER_URL}/api/results?page=${page}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Get error with code: ${response.status}`);
                }
                return response.json();
            })
            .then((results: {results: ResultItem[], totalPages: number}) => {
                dispatch(createGetResultsSuccess(results));
                onSuccess();
            })
            .catch(error => {
                dispatch(createGetResultsFail(error.message));
            });
    };
};

export const deleteResultThunk = (id: number) => {
    return (dispatch: Dispatch<AppAction>) => {
        dispatch(createStartLoading())
        fetch(`${SERVER_URL}/api/delete/${id}` , {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Get error with code: ${response.status}`);
                }
                return response;
            })
            .then(() => {
                dispatch(createDeleteResultSuccess(id));
                const state = store.getState().results;
                if(state.results.length <= 0 && state.page > 1) {
                    store.dispatch(getResultsThunk(state.page-1, 10))
                    store.dispatch(setPage(state.page-1))
                } else {
                    store.dispatch(getResultsThunk(state.page, 10))
                }
            })
            .catch(error => {
                dispatch(createResultRequestFail(error.message));
            });
    };
};


export const addResultThunk = (formData: CoordinatesRequest) => {
    return (dispatch: Dispatch<ResultsActionType>) => {
        dispatch(createStartLoading())
        fetch(`${SERVER_URL}/api/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Get error with code: ${response.status}`);
                }
                return response.json();
            })
            .then((result: ResultItem) => {
                store.dispatch(getResultsThunk(1, 10, ()=> {
                    store.dispatch(setPage(1));
                }));
                dispatch(createAddResultSuccess(result));
            })
            .catch(error => {
                dispatch(createResultRequestFail(error.message));
            });

    }
};

