const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'database-hanes.cn4kwaymuvxo.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'rootAdmin01!',
  database: 'hanes'
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos con ID:', connection.threadId);
});

module.exports = connection;
