const GET_MISSIONS = 'GET_MISSIONS'
const GAME_END = 'GAME_END'

export const getMissions = missions => ({
  type: GET_MISSIONS,
  missions
})

/* this action might be unessacary*/

export const gameEnd = result => ({
  type: GAME_END,
  result
})

const initialState = {}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MISSIONS:
      console.log('THIS IS TON THE REDUCER', action)
      return action.missions // {1:'fail', 2:'succeed' }
    case GAME_END:
      return action.result // { gameEndResult:'bad'} or gameEndResult:'good'}
    default:
      return state
  }
}
