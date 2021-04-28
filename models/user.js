const bcrypt = require('bcrypt')

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.belongsToMany(User, { through: 'UserUser', as: 'Watcher' })
    }

    validPassword (password) {
      return bcrypt.compareSync(password, this.password)
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Email 格式錯誤'
        }
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    intro: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hobbies: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate (user, options) {
        user.password = (user.password && user.password !== '') ? bcrypt.hashSync(user.password, 10) : null
      }
    }
  })
  return User
}
