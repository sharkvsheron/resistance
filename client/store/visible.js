import axios from 'axios'

const GET_VISIBILITY = 'GET_VISIBILITY'

export const getVisibility = visibility => ({
  type: GET_VISIBILITY,
  visibility
})

const initialState = {}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_VISIBILITY:
      return action.visibility
    default:
      return state
  }
}
