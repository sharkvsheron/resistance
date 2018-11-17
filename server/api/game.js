const router = require('express').Router()
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const {Game, User, GameType, Nomination, Role} = require('../db/models')
module.exports = router

//all route are base '/api/game/'

router.get('/', async (req, res, next) => {
  try {
    const allGames = await Game.findAll()
    res.status(202).json(allGames)
  } catch (err) {
    next(err)
  }
})

//INPUT: userId
//OUTPUT: return obj {gameId: currentUsersGameId}

/* **** REFACTORED INTO FUNCTION, NOT IN USE ANYMORE **** */
router.get('/:userId', async (req, res, next) => {
  try {
    const currentUsersInstance = await User.findOne({
      where: {id: req.params.userId}
    })
    const currentUsersGameId = currentUsersInstance.gameId
    res.json({gameId: currentUsersGameId})
  } catch (err) {
    next(err)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const {userId, gameId} = req.body
    const user = await User.findById(userId)
    const userWithGameId = await user.update({gameId})
    res.status(202).json(userWithGameId)
  } catch (err) {
    next(err)
  }
})

/*
 *USE CASE: Getting all the players and what the input player can see about their roleIds,
 *INPUT: No Input,
 *OUTPUT: An object with format {playerId: roleId} that has every player in the game
 */
router.get('/players/:userId', async (req, res, next) => {
  try {
    // const userId = req.session.userId;
    const userId = req.params.userId
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
    res.json(playerVisibility)
  } catch (error) {
    next(error)
  }
})

/*/nominator/:userId
INPUT userId
RETURN OBJ {currentNominator : id}*/
router.get('/nominator/:userId', async (req, res, next) => {
  try {
    const {userId} = req.params
    const user = await User.findById(userId)
    const nomination = await Nomination.findOne({
      where: {
        gameId: user.gameId,
        userId: userId,
        missionStatus: {[Op.eq]: null}
      }
    })
    const nominator = nomination.getNominator()
    res.json(nominator)
  } catch (error) {
    next(error)
  }
})

//INPUT: gameId
//OUTPUT: an array with all users of the same gameId
router.get('/waiting-phase/:gameId', async (req, res, next) => {
  try {
    const {gameId} = req.params
    const allPlayers = await User.findAll({where: {gameId: gameId}})
    res.json(allPlayers)
  } catch (err) {
    next(err)
  }
})
