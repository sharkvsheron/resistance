const fetch = require('node-fetch')
const {
  startGame,
  getNominations,
  getVisibility,
  getCurrentNominator,
  submitVote
} = require('./functions')
const {User} = require('../db/models')
/*
  Params: socket
  Returns: gameRoom that socket is in
  Side Effects: assigns the socket to the room with gameId
*/

const joinGameRoom = async socket => {
  console.log(socket.id)
  const socketId = socket.id
  const user = await User.findOne({where: {socketId}})
  const gameId = user.dataValues.gameId
  socket.join(gameId)
  return gameId
}

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('startGame', async userId => {
      await startGame(userId)
      //potential refactor--joining game room not necc, just the return val.
      const gameRoom = await joinGameRoom(socket)
      const startingState = await getNominations(userId)
      //selectively emits to only people in the gameRoom
      io.in(gameRoom).emit('gameStarted', startingState)
    })

    socket.on('getVisibility', async userId => {
      const visibility = await getVisibility(userId)
      console.log('server listener for getVisiblity reached', visibility)
      io.to(`${socket.id}`).emit('getVisibility', visibility)
    })

    //When user clicks join game, their socket joins the appropriate gameRoom
    socket.on('syncSocketId', async userId => {
      await fetch(`http://localhost:8080/api/users/${userId}/${socket.id}`, {
        method: 'PUT',
        body: ''
      })
      await joinGameRoom(socket)
    })

    //When user clicks Submit Vote, this socet will write vote to db.
    socket.on('submitVote', async (userId, missionResult) => {
      const gameRoom = await joinGameRoom(socket)
      console.log('server listener for submitVote reached USER ID', userId)
      console.log(
        'server listener for submitVote reached MISSON RESUKT',
        missionResult
      )
      const nominator = await getCurrentNominator(userId)
      console.log('THISIS THE USER ID ', userId)
      console.log('THISIS THE nominatorid ', nominator)
      if (userId == nominator) {
        const vote = await submitVote(userId, missionResult)
        console.log('THIS IS INSIDE THE INDEX SUBMIT VOTE', vote)
        io.in(gameRoom).emit('voteSubmitted', vote)
      } else {
        const vote = 'NOT THE NOMINATOR'
        console.log('THIS IS INSIDE THE INDEX SUBMIT VOTE', vote)
        io.in(gameRoom).emit('voteSubmitted', vote)
      }
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
