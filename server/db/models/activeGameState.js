const db = require('../db')


const ActiveGameState = db.define('activeGameState', {

UserId:{
  type:{

  },
  validate:{}
},

  RoleId:{
    type:{

    },
    validate:{}
  }
,

  currentQuestId:{
    type:{

    },
    validate:{}
  }
,currentNom:{
  type:{

  },
  validate:{}
},
})

module.exports = ActiveGameState;
