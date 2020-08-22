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
  console.log("connected as id " + connection.threadId);
  start();
});
function start(){
inquirer.prompt ([{
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
          "Quit",
        ]
      }])

.then(function (answers){
  switch (answers.liste) {
    case "View All Employees":
      employeesSearch();
      break;
    case "View All Employees By Department":
      employeesDepartment();
      break;
    case "View All Employees By Manager":
      employeesManager();
      break;
    case "View all the departments":
      departmentsSearch();
      break;
    case "Add Employee":
      addEmployees();
      break;
    case "Remove Employee":
      removeEmployees();
      break;
    case "Update Employee Role":
      updateEmployeerole();
      break;
    case "Update Employee Manager":
      updateEmployeemanager();
      break;
    case "Quit":
      connection.end();
      break;
  }
  });
}
function employeesSearch() {
  connection.query(`SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e LEFT JOIN role r ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`, function (err, res){
    if(err) throw err;
    console.table(res)
    console.log()
    start();
  });
  }

  
