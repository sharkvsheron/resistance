const router = require('express').Router()
const {Game, User, GameType, Nomination} = require('../db/models')
module.exports = router

router.put('/', async (req, res, next) => {
  try {
    const {userId, gameId} = req.body
    const user = await User.findById(userId)
    await user.update({gameId})
    res.status(202).send('changed users gameiD')
  } catch (err) {
    next(err)
  }
})

router.put('/start/:gameId', async (req, res, next) => {
  try {
    const {gameId} = req.params
    const {gameTypeId} = await Game.findById(gameId)
    const users = await User.findAll({where: {gameId}})
    const game = await GameType.findById(gameTypeId)
    if (users.length === game.numberOfPlayers) {
      await game.assignRoles(users)
      res.sendStatus(200)
    } else {
      res.json({message: 'NOT ENOUGH PLAYERS'})
    }
  } catch (error) {
    next(error)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const {userId, gameId} = req.body
    const user = await User.findById(userId)
    await user.update({gameId})
    res.status(202).send('changed users gameiD')
  } catch (err) {
    next(err)
  }
})
