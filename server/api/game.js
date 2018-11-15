const router = require('express').Router()
const {Game, User} = require('../db/models')
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
