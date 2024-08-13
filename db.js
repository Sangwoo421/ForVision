const { Sequelize } = require('sequelize'); // Sequelize 모듈 불러오기
const config = require('./config/config.json'); // 데이터베이스 설정을 담고 있는 config.json 불러오기
const env = process.env.NODE_ENV || 'development'; // 현재 환경을 가져오거나 기본값으로 'development' 사용
const dbConfig = config[env]; // 현재 환경에 맞는 데이터베이스 설정 가져오기

// MySQL 데이터베이스 설정
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
});

module.exports = sequelize; // Sequelize 인스턴스를 모듈로 내보내기