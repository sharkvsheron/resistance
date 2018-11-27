const db = require('../db')
const Sequelize = require('sequelize')
const User = require('./user')

const GameType = db.define('gameTypes', {
  numberOfPlayers: {
    type: Sequelize.INTEGER,
    validate: {
      min: 5,
      max: 12
    }
  },
  rolesAvailable: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  },
  missions: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  }
})

const shuffle = array => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

GameType.prototype.assignRoles = async function(usersArray) {
  const roles = shuffle(this.rolesAvailable)
  await usersArray.forEach(user => {
    user.roleId = roles[0]
    user.save()
    roles.shift()
  })
  return usersArray
}

module.exports = GameType
