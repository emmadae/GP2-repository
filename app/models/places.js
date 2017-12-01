module.exports = function(sequelize, DataTypes){
// Creates a "player" model
var Places = sequelize.define("places", {
pos_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  id_grp: {
    type: DataTypes.INTEGER
  },
  c_owner: {
    type: DataTypes.STRING
  },
  rent_lvl: {
    type: DataTypes.INTEGER
  },
  name:{
    type: DataTypes.STRING
  },
  rent:{
    type: DataTypes.INTEGER
  },
  active:{
    type: DataTypes.BOOLEAN
  }
}, {
  timestamps: false
});

// Syncs with DB
Places.sync();
return Places;
// Makes the Book Model available for other files (will also create a table)
//module.exports = Places;
};
