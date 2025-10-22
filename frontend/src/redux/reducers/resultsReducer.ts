import type {ResultsState} from '../types.ts';
import type {ResultsActionType} from "../actions/resultsActions.ts";



export const resultsInitialState: ResultsState = {
    results: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    r: 0
};

export default function reducer(state: ResultsState = resultsInitialState, action: ResultsActionType): ResultsState {
    switch (action.type) {
        case 'RESULT_REQUEST_START_ACTION':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case "GET_RESULTS_FAIL_ACTION":
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case 'GET_RESULTS_ACTION':
            return {
                ...state,
                loading: false,
                results: action.payload.results,
                totalPages: action.payload.totalPages
            };

        case 'ADD_RESULT_SUCCESS_ACTION':
            return {
                ...state,
                loading: false,
                //results: [action.payload]
            };

        case 'RESULT_REQUEST_FAIL_ACTION':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case "CHANGE_R":
            return {
                ...state,
                r: action.payload,
            };
        case "DELETE_RESULT_SUCCESS":
            return {
                ...state,
                loading: false,
                results: state.results.filter(result => result.id !== action.payload)
            };
        case "RESET_ERROR_ACTION":
            return {
                ...state,
                error: null
            };
        case "SET_PAGE":
            return {
                ...state,
                page: action.payload
            }
        case "SET_TOTAL_PAGES":
            return {
                ...state,
                totalPages: action.payload
            }
        default:
            return state;
    }
}