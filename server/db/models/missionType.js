const db = require('../db')
const Sequelize = require('sequelize')

const MissionType = db.define('missionTypes', {
  numberOfPlayers: {
    type: Sequelize.STRING,
    validate: {}
  },
  failsRequired: {
    type: Sequelize.STRING,
    validate: {}
  }
})

module.exports = MissionType
