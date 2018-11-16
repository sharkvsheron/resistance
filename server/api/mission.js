const router = require('express').Router()
const {Game, User, GameType, Nomination} = require('../db/models')
module.exports = router

router.put('/', async (req, res, next) => {
  try {
    const {userId} = req.session.userId
    const {nominatorId, missionResult, id, missionTypeId} = req.body
    const nomination = Nomination.findById(id)
    if (userId === nominatorId) {
      Nomination.update({where: {id: id}})
    } else {
      res.send('Unathorized')
    }
    if (missionTypeId === 5) {
      gameResult()
    } else {
      const newNominator = nominatio.nextNominator()
      const newMission = nomination.nextMission()
      Nomination.create({})
    }
  } catch (err) {
    next(err)
  }
})

//is game over?
