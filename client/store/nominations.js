const GET_NOMINATIONS = 'GET_NOMINATIONS'

export const getNominations = nominations => ({
  type: GET_NOMINATIONS,
  nominations
})

const initialState = {
  0: {
    id: 0,
    missionStatus: null,
    missionTypeId: 0,
    nominationStatus: null,
    nominees: [],
    userId: 0
  }
}
/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_NOMINATIONS:
      return action.nominations
    default:
      return state
  }
}
