const db = require('../db')


const Nomination = db.define('nominations', {

questId:{
  type:{

  },
  validate:{}
},

  nominator:{
    type:{

    },
    validate:{}
  },

  nominatee:{
    type:{

    },
    validate:{}
  },

  userNominations:{
    type:{

    },
    validate:{}
  },

  userId:{
    type:{

    },
    validate:{}
  },
  votes:{
  type:{

  },
  validate:{}
},
gameId:{
  type:{

  },
  validate:{}
},
pass:{
  type:{

  },
  validate:{}
}
})

module.exports = Nomination;
