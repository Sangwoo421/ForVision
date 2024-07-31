const { Sequelize } = require('sequelize');
const config = require('./config/config.json');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// MySQL 데이터베이스 설정
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
});

module.exports = sequelize;