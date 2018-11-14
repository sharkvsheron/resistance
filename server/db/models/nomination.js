const db = require('../db')
const Sequelize = require('sequelize')

const Nomination = db.define('nominations', {
  nominees: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    validate: {}
  },
  status: {
    type: Sequelize.ENUM('pass', 'fail'),
    allowNull: true,
    defaultValue: null
  }
})

module.exports = Nomination
