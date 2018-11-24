const GET_GAME_RESULT = 'GET_GAME_RESULT'

export const getGameResult = gameResult => ({type: GET_GAME_RESULT, gameResult})

const initialState = 'none';

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_GAME_RESULT:
            return action.gameResult
        default:
            return state
    }
}