
module.exports = function(sequelize, DataTypes) {
// Creates a "player" model
var Chance = sequelize.define("chance_cards", {
cha_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
card_title: {
    type: DataTypes.STRING
  },
card_text:{
    type: DataTypes.TEXT
  },
card_value:{
    type: DataTypes.INTEGER
}
}, {
  timestamps: false
});

// Syncs with DB
//Chance.sync();
return Chance;
// Makes the Book Model available for other files (will also create a table)
//module.exports = Chance;
};
