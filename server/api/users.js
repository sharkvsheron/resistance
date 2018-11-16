const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.put('/:userId/:socketId', async (req, res, next) => {
  try {
    const {userId, socketId} = req.params;
    const user = await User.findById(userId);
    const updatedUser = await user.update({socketId})
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
})
