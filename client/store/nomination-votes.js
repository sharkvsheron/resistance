const GET_NOMINATION_VOTES = 'GET_NOMINATION_VOTES'

export const getNominationVotes = nominationVotes => ({
  type: GET_NOMINATION_VOTES,
  nominationVotes
})

const initialState = {}
/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_NOMINATION_VOTES:
      return action.nominationVotes
    default:
      return state
  }
}
