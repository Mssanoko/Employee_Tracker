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
  runSearch();
});
inquirer.prompt (
    [
      {
        message:"What would you like to do?",
        type: "list",
        name: "liste",
        choices:[
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "View all the departments",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",

        ]
      }
    ]
)
.then(function (answers){
  console.log(answers.liste)
  switch (answers.liste) {
    case
  }
})

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  connection.end();
});

   