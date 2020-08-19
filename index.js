var mysql      = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : 'LeslieRoot',
  database : 'employeet_db'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('')
  });

  connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
   