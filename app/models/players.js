module.exports = function(sequelize, DataTypes){
// Creates a "player" model
var Players = sequelize.define("players", {
user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  user_name: {
    type: DataTypes.STRING
  },
  user_money: {
    type: DataTypes.INTEGER
  },
  is_turn: {
    type: DataTypes.BOOLEAN
  },
  pos_id:{
    type: DataTypes.INTEGER
  },
  in_jail:{
    type: DataTypes.INTEGER
  },
  user_image:{
    type: DataTypes.STRING
  },
  is_active:{
    type:DataTypes.BOOLEAN
  }
}, {
  timestamps: false
});

// Syncs with DB
Players.sync();
return Players;
// Makes the Book Model available for other files (will also create a table)
//module.exports = Players;
};
