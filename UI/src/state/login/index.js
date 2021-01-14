import { switchMap, catchError, map } from 'rxjs/operators'
import { of, from } from 'rxjs'
import axios from 'axios'
import { ofType } from 'redux-observable'
import { services } from '../../components/common/constant'


// Action-type 
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export const SIGNUP_RESET = 'SIGNUP_RESET'
export const SET_ROLE = 'SET_ROLE'

//Actions

export const loginReq = payload => ({ type: LOGIN_REQUEST, payload })
export const userDetail = payload => ({ type: LOGIN_SUCCESS, payload })
export const signupReq = payload => ({ type: SIGNUP_REQUEST, payload })
export const userCreated = payload => ({ type: SIGNUP_SUCCESS, payload })
export const setRole = payload => ({ type: SET_ROLE, payload })
export const resetSignup = () => ({ type: SIGNUP_RESET })

export const epics = {
    loginUser: (action$, state$) => action$.pipe(
        ofType(LOGIN_REQUEST),
        switchMap(({ type, payload }) => {
            switch (type) {
                case LOGIN_REQUEST: {
                    const dataVar = payload
                    return from(axios.post(services.baseUrl + services.login, dataVar, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })).pipe(
                        map(response => userDetail(response)),
                        catchError(error => of(console.error(error)))
                    )
                }
            }
        })
    ),
    signUp: (action$, state$) => action$.pipe(
        ofType(SIGNUP_REQUEST),
        switchMap(({ type, payload }) => {
            switch (type) {
                case SIGNUP_REQUEST: {
                    const dataVar = payload
                    console.log(services.baseUrl + services.register)
                    return from(axios.post(services.baseUrl + services.register, dataVar, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })).pipe(
                        map(response => userCreated(response)),
                        catchError(error => of(console.error(error)))
                    ).subscribe(response => console.log(response));
                }
            }
        })
    )
}
export const initialState = {
    fetchProgress: false
}

// REDUCERS
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                fetchProgress: true
            }
        case SIGNUP_REQUEST:
            return {
                ...state,
                fetchProgress: true
            }
        case LOGIN_SUCCESS:
            if (action.payload) {
                sessionStorage.setItem('user', JSON.stringify(action.payload.data))
                return {
                    ...state,
                    fetchProgress: false,
                    user: action.payload.data
                }
            } else {
                alert(action.payload)
                return {
                    ...state,
                    fetchProgress: false,
                }
            }
        case SIGNUP_RESET:
            return {
                ...state,
                fetchProgress: false,
                signupmessage: ''
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                fetchProgress: false,
                signupmessage: action.payload.data.message
            }
        case SET_ROLE:
            return {
                ...state,
                role: action.payload
            }
        default:
            return state
    }
}

//selectors
export const getAuthToken = state => state.login.authToken
export const getUser = state => state.login.user
export const fetchProgress = state => state.login.fetchProgress
export const getNewUser = state => state.login.signupmessage
export const getRole = state => state.login.role