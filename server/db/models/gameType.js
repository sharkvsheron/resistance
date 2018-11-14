const db = require('../db')


const GameType = db.define('gametypes', {

numberOfPlayers:{
  type:{

  },
  validate:{}
},
  roles:{
    type:{

    },
    validate:{}
  },

})

module.exports = GameType;
