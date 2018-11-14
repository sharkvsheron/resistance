const db = require('../db')


const MissionType = db.define('missionTypes', {

numberOfPlayers:{
  type:{

  }
  ,validate:{}
},
failsRequired:{
  type:{

  }
  ,validate:{}
},

})

module.exports = MissionType;
