
const mysql = require('mysql2');

// 连接数据库
module.exports = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  // password: 'w640706608',
  database: 'approval_project',
  dateStrings: true
});