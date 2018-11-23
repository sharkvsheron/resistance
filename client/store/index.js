import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import games from './games'
import players from './players'
import missions from './mission'
import video from './video'
import nominations from './nominations'
import nominationVotes from './nomination-votes'

const reducer = combineReducers({
  user,
  games,
  players,
  missions,
  video,
  nominations,
  nominationVotes
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
