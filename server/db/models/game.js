const db = require('../db')


const Game = db.define('games', {

playersRequired:{
  type:{

  }
},

  playersInLobby:{
    type:{

    }
  },

  currentQuest:{
    type:{

    }
  },
currentNominationId:{
  type:{

  }
},

})

module.exports = Game;

//methods:
// how many players associated to this game.
