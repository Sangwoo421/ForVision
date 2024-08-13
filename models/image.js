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
// 외래 키를 명시적으로 설정
Image.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Image, { foreignKey: 'userId' });

module.exports = Image;
