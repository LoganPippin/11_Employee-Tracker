const mysql = require("mysql");
const inquirer = require("inquirer");
const { up } = require("inquirer/lib/utils/readline");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Coolguy7",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  render();
});

function render() {
  connection.query(
    "SELECT first_name, last_name, title, salary, manager_id FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id;",
    function (err, data) {
      if (err) throw err;
      console.table(data);
      askQuestions();
    }
  );
}

function askQuestions() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "type",
        message: "What do you want to do?",
        choices: [
          "Add department",
          "Add roles",
          "Add employess",
          "View Department",
          "View roles",
          "View Employees",
          "Update Employee roles",
        ],
      },
    ])
    .then((res) => {
      if (res.type === "Add department") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "depart",
              message: "What is the new department?",
            },
          ])
          .then((res2) => {
            createNewDepart(res2);
          });
      }
      if (res.type === "Add roles") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "role",
              message: "What is the new role?",
            },
          ])
          .then((res2) => {
            createNewRole(res2);
          });
      }
      if (res.type === "Add employee") {
        connection.query(
          "SELECT first_name, last_name, title, salary, manager_id FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id;",
          function (err, results) {
            inquirer
              .prompt([
                {
                  type: "input",
                  name: "first",
                  message: "What is the employees first name?",
                },
                {
                  type: "input",
                  name: "last",
                  message: "What is the employees last name?",
                },
                {
                  type: "list",
                  name: "role",
                  message: "What is the employees role?",
                  choices: function () {
                    return results.map((employee) => employee.title);
                  },
                },
                {
                  type: "list",
                  name: "last",
                  message: "Who is the Employess Manager?",
                  choices: function () {
                    return results.map((employee) => employee.manager_id);
                  },
                },
              ])
              .then((res2) => {
                createNewEmply(res2);
              });
          }
        );
      }
    });
}
