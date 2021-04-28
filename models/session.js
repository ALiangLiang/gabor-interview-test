const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate (models) {
    }
  }
  Session.init({
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: DataTypes.STRING,
    expires: DataTypes.DATE,
    data: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Session'
  })
  return Session
}
