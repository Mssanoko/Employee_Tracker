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
  switch (answers.action) {
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
      connection.end();
      break;
  }
  });
}

//View All Employees
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

//Add Employees
  function addEmployees() {
    console.log("Congrats! You Insert an employee!")
    var query =
      `SELECT r.id, r.title, r.salary 
        FROM role r`
    connection.query(query, function (err, res) {
      if (err) throw err;
      const roleChoices = res.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`
      }));
      console.table(res);
      console.log("RoleToInsert!");
      promptInsert(roleChoices);
    });
  }
  
  function promptInsert(roleChoices) {
  
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?"
        },
        {
          type: "list",
          name: "roleId",
          message: "What is the employee's role?",
          choices: roleChoices
        },

      ])
      .then(function (answers) {
        console.log(answers);
  
        var query = `INSERT INTO employee SET ?`
        connection.query(query,
          {
            first_name: answers.first_name,
            last_name: answers.last_name,
            role_id: answers.roleId,
            manager_id: answers.managerId,
          },
          function (err, res) {
            if (err) throw err;
            console.log("Inserted successfully!\n");
            start();
          });
      });
  }
  //Add Department
  function addDepartment() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.log("----------    Existing records in department table     ----------- ");
        console.table(res);
    inquirer
        .prompt([
            {
                name: "dept_name",
                type: "input",
                message: "Enter department name to be added: "
            }
        ]).then(function (answer) {
            var query = `INSERT INTO department(name) VALUES ("${answer.dept_name}")`;
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log("A new department with name '" + answer.dept_name + "' has been added to the DB.");
                console.log(" ");
                console.log(" ");
                end();
            })
        })
    });
  }
   
  //Remove Employee
  function removeEmployees(choice) {
    connection.query("SELECT * FROM " + choice, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].first_name);
                    }
                    return choiceArray;
                },
                message: "Remove employee"
            }]).then(function (answers) {
                var query = `DELETE FROM employee WHERE first_name = "${answers.choice}"`;
                connection.query(query, function (err, res) {
                    if (err) throw err;
                    console.log("The employee with name " + answers.choice + " has been deleted from the system.");
                    console.log(" ");
                    console.log(" ");
                    end();
                })
            });
    });
}
