const db = require('../db')
const Sequelize = require('sequelize')

const MissionVote = db.define('missionVotes', {
  vote: {
    type: Sequelize.ENUM('success', 'fail'),
    validate: {}
  }
})

module.exports = MissionVote
