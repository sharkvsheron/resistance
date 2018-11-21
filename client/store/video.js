import axios from 'axios'
import {bindActionCreators} from 'redux'

const initialState = {
  sessionId: '',
  sessionKey: ''
}

const GET_SESSION_ID = 'GET_SESSIONID'
const GET_SESSION_KEY = 'GET_SESSIONKEY'

export const getSessionId = sessionId => ({
  type: GET_SESSION_ID,
  sessionId
})
export const getSessionKey = sessionKey => ({
  type: GET_SESSION_KEY,
  sessionKey
})

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SESSION_ID:
      return {...state, sessionId: action.sessionId}
    case GET_SESSION_KEY:
      return {...state, sessionKey: action.sessionKey}
    default:
      return state
  }
}
