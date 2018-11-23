import io from 'socket.io-client'
import store from './store'
import {getPlayers, getVisibility} from './store/players'
import {getGames} from './store/games'
import {getMissions} from './store/mission'
import {getSessionId, getSessionKey} from './store/video'
import {getNominations} from './store/nominations'
import {getNominationVotes} from './store/nomination-votes'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')

  socket.on('createdNewGame', allGames => {
    store.dispatch(getGames(allGames))
  })
  socket.on('getSessionIdAndKey', keyAndId => {
    const {sessionKey, sessionId} = keyAndId
    store.dispatch(getSessionId(sessionId))
    store.dispatch(getSessionKey(sessionKey))
  })
  socket.on('getGames', allGames => {
    store.dispatch(getGames(allGames))
  })
  socket.on('getPlayers', players => {
    store.dispatch(getPlayers(players))
  })

  socket.on('gameStarted', (nominations, nominationVotes) => {
    // console.log('received starting state from server', startingState)
    console.log(nominations)
    store.dispatch(getNominations(nominations))
    store.dispatch(getNominationVotes(nominationVotes))
  })

  socket.on('getVisibility', visibilityObj => {
    store.dispatch(getVisibility(visibilityObj))
  })

  socket.on('nominationSubmitted', (nominations, nominationVotes) => {
    store.dispatch(getNominations(nominations))
    store.dispatch(getNominationVotes(nominationVotes))
  })
})
socket.on('voteSubmitted', vote => {
  store.dispatch(getMissions(vote))
})

export default socket
