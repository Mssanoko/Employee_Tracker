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
          "View Department",
          "View Role",
          "View All Employees By Manager",
          "Add Employee",
          "Add a Department",
          "Add a Role",
          "Remove Employee",
          "Remove a Department",
          "Remove a Role",
          "Update Employee Role",
          "Update Employee Manager",
          "Department's budget",
          "Quit",
        ]
      }])

.then(function (answers){
  switch (answers.liste) {
    case "View All Employees":
      employeesView();
      break;
    case "View Departments":
      departmentView();
      break;
    case "View Role":
      roleView();
      break;
    case "View All Employees By Manager":
      employeesManager();
      break;
    case "Add Employee":
      addEmployees();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "Add A role":
      addRole();
      break;
    case "Remove Employee":
      removeEmployees();
      break;
    case "Remove Department":
      removeDepartment();
      break;
    case "Remove role":
      removeRole();
      break; 
    case "Update Employee Role":
      updateEmployeerole();
      break;
    case "Update Employee Manager":
      updateEmployeemanager();
      break;
    case "Quit":
      end()
      connection.end();
      break;
  }
  });
}

//View All Employees
function employeesView() {
  console.log("Viewing employees\n");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id`

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    start();
  });
}
//View Roles
function roleView() {
	// console.log("You are viewing roles");
    connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.log(`You are viewing ${res.length} roles`);
    console.table("All Roles:", res); 
    start();
    })
}
//add employee
function addEmployees() {
	// console.log("You are adding employees");
	// connection.query("SELECT role.title, employee.first_name, employee.last_name, employee.role_id, manager_id FROM role FULL OUTER JOIN employee ON employee.role_id=role.id ORDER BY role.title", 
	connection.query("SELECT * FROM role", function (err, res) {
		if (err) throw err;
		inquirer
			.prompt([
				{
					name: "first_name",
					type: "input", 
					message: "What is the employee's first name?",
				},
				{
					name: "last_name",
					type: "input", 
					message: "What is the employee's last name?"
				},
				{
					name: "role", 
					type: "list",
					choices: function() {
					var roleArray = [];
					for (var i = 0; i < res.length; i++) {
						roleArray.push(res[i].title);
					}
					return roleArray;
					},
					message: "What is the employee's role?"
				},
				
				])
			.then(function (answer) {
				var roleID;
				for (var i = 0; i < res.length; i++) {
					if (res[i].title == answer.role) {
						roleID = res[i].id;
						console.log(roleID)
					}                  
				}  
				connection.query(
				"INSERT INTO employee SET ?",
				{
					first_name: answer.first_name,
					last_name: answer.last_name,
					role_id: roleID,
				},
				function (err) {
					if (err) throw err;
					console.log("New employee has been added!");
					start();
				}
			)
		})
	})

}

//remove employee 
function removeEmployees() {
  connection.query("SELECT * FROM employee", function (err, results) {
      if (err) throw err;
      inquirer.prompt({
          name: "employee",
          type: "list",
          message: "Select which employee you would like to remove.",
          choices: function () {
              var employeeArray = [];
              for (var i = 0; i < results.length; i++) {
                  employeeArray.push(results[i].first_name + " " + results[i].last_name);
              }
              return employeeArray;
          }
      }).then(function (answer) {
          connection.query(
              "DELETE FROM employee WHERE id = (SELECT id WHERE CONCAT (first_name, ' ', last_name) = ?)",
              [answer.employee],
              function (err, res) {
                  if (err) throw err;
                  start();
              })
      })
  })
};

// QUIT 
function end() {
  inquirer
      .prompt({
          name: "action",
          type: "list",
          message: "Would you like to continue? ",
          choices: [
              "Yes",
              "No",
          ]
      }).then(function (answer) {
          if (answer.action === "Yes") {
              console.log(" ");
              console.log(" ");
              start();
          } else {
              console.log(" ");
              console.log("Thank you for using employee tracker. Have a great day ahead.");
              connection.end()
          }

      })
}




