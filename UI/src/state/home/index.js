import { switchMap, catchError, map } from 'rxjs/operators'
import { of, from } from 'rxjs'
import { ofType } from 'redux-observable'
import axios from 'axios'
import { services } from '../../components/common/constant'

// Action-type
export const INIT_LOAD = 'INIT_LOAD'
export const APP_LOADED = 'LOADED'
export const SET_VIDEO = 'SET_VIDEO'
export const SEARCH_REQUEST = 'SEARCH_REQUEST'
export const SEARCH_REQUEST_SUCCESS = 'SEARCH_REQUEST_SUCCESS'

//Actions

export const initLoadData = () => ({ type: INIT_LOAD })
export const appLoaded = payload => ({ type: APP_LOADED, payload })
export const setVideo = payload => ({ type: SET_VIDEO, payload })
export const searchRequest = payload => ({ type: SEARCH_REQUEST, payload })
export const searchRequestSuccess = payload => ({
  type: SEARCH_REQUEST_SUCCESS,
  payload
})

export const epics = {
  initLoadData: (action$, state$) =>
    action$.pipe(
      ofType(INIT_LOAD),
      switchMap(({ type, payload }) => {
        return of(appLoaded('test'))
      })
    ),
  search: (action$, state$) =>
    action$.pipe(
      ofType(SEARCH_REQUEST),
      switchMap(({ payload }) => {
        return from(
          axios.get(
            services.baseUrl + services.searchRecord,
            {
              params: payload
            },
            {
              headers: {
                'Content-type': 'application/json'
              }
            }
          )
        ).pipe(
          map(response => searchRequestSuccess(response)),
          catchError(error => of(console.error(error)))
        )
      })
    )
}
export const initialState = {
  getVideo: {},
  search: []
}

// REDUCERS
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case APP_LOADED:
      return {
        ...state,
        loadData: action.payload
      }
    case SET_VIDEO:
      return {
        ...state,
        getVideo: action.payload
      }
    case SEARCH_REQUEST_SUCCESS:
        debugger
      return {
        ...state,
        search: JSON.parse(action.payload.data).search_result[1]
      }
    default:
      return state
  }
}

export const getInitData = state => state.home.loadData

export const getVideo = state => state.home.getVideo
export const getSearchResult = state => state.home.search
