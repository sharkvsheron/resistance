const fetch = require('node-fetch')
const {
  startGame,
  getNominations,
  getVisibility,
  getCurrentNominator,
  submitVote,
  getPlayersWithUserId
} = require('./functions')
const {User, Game} = require('../db/models')
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

    socket.on('getGames', async () => {
      const allGames = await Game.findAll()
      io.to(`${socket.id}`).emit('getGames', allGames)
    })
    socket.on('joinGame', async (userId, gameId) => {
      const user = await User.findById(userId)
      await user.update({gameId})
    })

    socket.on('getPlayers', async userId => {
      const players = await getPlayersWithUserId(userId)
      const gameRoom = await joinGameRoom(socket)
      io.in(gameRoom).emit('getPlayers', players)
      const user = await User.findById(userId)
      const users = await User.findAll({where: {gameId: user.gameId}})
      users.forEach(async user => {
        let visibility = await getVisibility(user.id)
        io.to(`${user.socketId}`).emit('getVisibility', visibility)
      })
    })

    socket.on('startGame', async userId => {
      await startGame(userId)
      //potential refactor--joining game room not necc, just the return val.
      const gameRoom = await joinGameRoom(socket)
      const startingState = await getNominations(userId)
      //selectively emits to only people in the gameRoom
      io.in(gameRoom).emit('gameStarted', startingState)
      const user = await User.findById(userId)
      const users = await User.findAll({where: {gameId: user.gameId}})
      users.forEach(async user => {
        let visibility = await getVisibility(user.id)
        io.to(`${user.socketId}`).emit('getVisibility', visibility)
      })
    })

    socket.on('getVisibility', async userId => {
      //FIX THIS SHIT
      let visibility = await getVisibility(userId)
      console.log(visibility, userId)
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
      const nominator = await getCurrentNominator(userId)
      if (userId == nominator) {
        const vote = await submitVote(userId, missionResult)
        io.in(gameRoom).emit('voteSubmitted', vote)
      } else {
        const vote = 'NOT THE NOMINATOR'
        io.in(gameRoom).emit('voteSubmitted', vote)
      }
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
