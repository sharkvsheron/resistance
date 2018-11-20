const END_GAME = 'END_GAME'

export const endGame = gameEndResult => ({type: END_GAME, gameEndResult})

const initialState = "";

export default function(state = initialState, action) {
    switch (action.type) {
        case END_GAME:
            return action.gameEndResult
        default:
            return state
    }
}