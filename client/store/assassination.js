const ENABLE_ASSASSINATION = 'ENABLE_ASSASSINATION'

export const enableAssassination = assassinationStatus => ({type: ENABLE_ASSASSINATION, assassinationStatus})

const initialState = {assassinationStatus: 'inactive', assasinId: -1};

export default function(state = initialState, action) {
    switch (action.type) {
        case ENABLE_ASSASSINATION:
            return action.assassinationStatus
        default:
            return state
    }
}