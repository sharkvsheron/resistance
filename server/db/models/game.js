const db = require('../db')
const Sequelize = require('sequelize')

const Game = db.define('game', {})

module.exports = Game

//methods:
// how many players associated to this game.
