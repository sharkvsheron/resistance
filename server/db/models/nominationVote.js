const db = require('../db')
const Sequelize = require('sequelize')

const NominationVote = db.define('nominationVotes', {
  vote: {
    type: Sequelize.ENUM('approve', 'reject')
  }
})

module.exports = NominationVote
