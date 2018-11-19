const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {Game, User, GameType, Nomination, Role} = require('../../db/models')

const hasBlankNomination = async gameId => {
  const blankNomination = await Nomination.findOne({
    where: {gameId, nominees: {[Op.eq]: []}}
  })
  return blankNomination !== null
}

const getNominationWithUserId = async userId => {
  const user = await User.findById(userId)
  const nomination = await Nomination.findAll({where: {gameId: user.gameId}})
  return nomination
}

const getGamewithUserId = async userId => {
  const user = await User.findById(userId)
  const gameId = user.gameId
  return Game.findById(gameId)
}
/*
    Params: userId
    Return: Nothing
    Side Effects: Creates the initial nomination instance of a game, assigns roleId's to users in game
*/

const startGame = async userId => {
  const user = await User.findById(userId)
  const gameId = user.gameId
  const {gameTypeId} = await Game.findById(gameId)
  const users = await User.findAll({where: {gameId}})
  const game = await GameType.findById(gameTypeId)
  const missionTypeId = game.missions[0]
  const isNewGame = !(await hasBlankNomination(gameId))
  if (users.length === game.numberOfPlayers && isNewGame) {
    await Nomination.create({
      nominees: [],
      gameId,
      missionTypeId,
      userId: users[Math.floor(Math.random() * users.length)].id
    })
    await game.assignRoles(users)
  }
}

/*
    Params: userId
    Return:
*/
const getNominations = async userId => {
  const user = await User.findById(userId)
  const nominations = await Nomination.findAll({where: {gameId: user.gameId}})
  const allNominations = {}
  nominations.forEach(nomination => {
    allNominations[nomination.dataValues.id] = nomination.dataValues
  })
  return allNominations
}

/*
      Params: userId
      Return: Object {currentNominator: userId}
*/
const getNominator = async userId => {
  return getNominationWithUserId(userId).getNominator()
}

/*
    Params: userId
    Return: none.
    BUT: This function will create a nw Mission and Nomination
*/

const submitVote = async (userId, missionResult) => {
  const nomination = await getNominationWithUserId(userId)
  const game = await getGamewithUserId(userId)
  if (Number(userId) === nomination.dataValues.userId) {
    await nomination.update({missionStatus: missionResult})
  } else {
    return 'Unathorized'
  }
  const result = await game.gameResult()
  if (result.teamWon !== 'none') return result
  else if (nomination.dataValues.missionTypeId < 5) {
    const newNominator = nomination.nextNominator()
    const newMission = nomination.nextMission()
    await Nomination.create({
      nominees: [],
      missionTypeId: newMission,
      userId: newNominator,
      gameId: nomination.gameId
    })
    const missionNominations = await Nomination.findAll({
      where: {
        gameId: game.id,
        missionStatus: {
          [Op.ne]: null
        }
      }
    })
    const missions = {}
    missionNominations.forEach(mission => {
      missions[mission.missionTypeId] = mission.missionStatus
    })
    return missions
  }
}
/*
  PARAMS: userId
  Return: object {player1: vis1, player2: vis2, etc.}
*/
const getVisibility = async userId => {
  const user = await User.findById(userId)
  const {roleId, gameId} = user
  const role = await Role.findById(roleId)
  const visibleRoles = role.visible
  const players = await User.findAll({where: {gameId}})
  const playerVisibility = {}
  players.forEach(player => {
    if (visibleRoles.includes(player.roleId))
      playerVisibility[player.id] = player.roleId
    else playerVisibility[player.id] = 0
  })
  return playerVisibility
}

module.exports = {
  startGame,
  getNominations,
  getNominator,
  submitVote,
  getVisibility
}
