const {
  startGame,
  getNominations,
  getVisibility,
  getCurrentNominator,
  submitVote,
  getPlayersWithUserId,
  getUsersInGame,
  syncSocket,
  broadcastVisibility
} = require('./functions')
const {User, Game} = require('../db/models')
const OpenTok = require('opentok')
/*
  Params: socket
  Returns: gameRoom that socket is in
  Side Effects: assigns the socket to the room with gameId
*/

const joinGameRoom = async socket => {
  const socketId = socket.id
  const user = await User.findOne({where: {socketId}})
  const gameId = user.dataValues.gameId
  socket.join(gameId)
  return gameId
}
let opentok = new OpenTok(
  '46223602',
  '0fc918d84f76d91bdb56aa52429bf60fb4ccf9fc'
)

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('getGames', async () => {
      const allGames = await Game.findAll()
      io.to(`${socket.id}`).emit('getGames', allGames)
    })

    socket.on('createGame', async userId => {
      let sessionId

      await opentok.createSession({mediaMode: 'routed'}, async function(
        err,
        session
      ) {
        if (err) {
          console.log(err)
          return
        }
        sessionId = session.sessionId
        // let sessionKey = opentok.generateToken(sessionId)
        // await User.update({sessionKey}, {where: {id: userId}})
        await Game.create({sessionId, gameTypeId: 1})
        const allGames = await Game.findAll()
        socket.emit('createdNewGame', allGames)
      })
    })

    socket.on('joinGame', async (userId, gameId) => {
      const game = await Game.findById(gameId)
      const sessionId = game.sessionId
      let sessionKey = opentok.generateToken(sessionId)

      await syncSocket(socket, userId)
      await joinGameRoom(socket)
      const user = await User.findById(userId)
      await user.update({sessionKey, gameId})
      const players = await getPlayersWithUserId(userId)
      const gameRoom = await joinGameRoom(socket)
      io.in(gameRoom).emit('getPlayers', players)
      const users = await User.findAll({where: {gameId: user.gameId}})
      broadcastVisibility(io, users)

      io.to(`${socket.id}`).emit('getSessionIdAndKey', {sessionId, sessionKey})
    })

    socket.on('getPlayers', async userId => {
      const players = await getPlayersWithUserId(userId)
      const gameRoom = await joinGameRoom(socket)
      io.in(gameRoom).emit('getPlayers', players)
      const users = await getUsersInGame(userId)
      broadcastVisibility(io, users)
    })

    socket.on('startGame', async userId => {
      await startGame(userId)
      //potential refactor--joining game room not necc, just the return val.
      const gameRoom = await joinGameRoom(socket)
      const startingState = await getNominations(userId)
      //selectively emits to only people in the gameRoom
      io.in(gameRoom).emit('gameStarted', startingState)
      const users = await getUsersInGame(userId)
      broadcastVisibility(io, users)
    })

    socket.on('getVisibility', async userId => {
      let visibility = await getVisibility(userId)
      io.to(`${socket.id}`).emit('getVisibility', visibility)
    })

    //When user clicks join game, their socket joins the appropriate gameRoom
    socket.on('syncSocketId', async userId => {
      await syncSocket(socket, userId)
    })

    //When user clicks Submit Vote, this socet will write vote to db.
    socket.on('submitVote', async (userId, missionResult) => {
      const gameRoom = await joinGameRoom(socket)
      const nominator = await getCurrentNominator(userId)
      if (userId == nominator) {
        const vote = await submitVote(userId, missionResult)
        io.in(gameRoom).emit('voteSubmitted', vote)
        // } else {
        //   const vote = {}
        //   io.in(gameRoom).emit('voteSubmitted', vote)
      }
    })

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
