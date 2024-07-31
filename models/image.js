const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./user');

const Image = sequelize.define('Image', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// 이미지와 유저 관계 설정 (다대일 관계)
Image.belongsTo(User);
User.hasMany(Image);

module.exports = Image;
