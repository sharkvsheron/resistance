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

const initialState = {
  1: {status: 'null', fails: 0},
  2: {status: 'null', fails: 0},
  3: {status: 'null', fails: 0},
  4: {status: 'null', fails: 0},
  5: {status: 'null', fails: 0}
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MISSIONS:
      // let newState = {...state}
      // let initialKeys = Object.keys(state)
      // let incomingKeys = Object.keys(action.missions)
      // let keyToReplace = incomingKeys.filter(
      //   value => value === incomingKeys[0]
      // )[0]
      // newState[keyToReplace] = action.missions[keyToReplace]
      // return newState
      return action.missions // {missionTypeId: {status: '', fails:num}, repeat}
    case GAME_END:
      return action.result // { gameEndResult:'bad'} or gameEndResult:'good'}
    default:
      return state
  }
}
