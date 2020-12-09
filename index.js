const mysql = require("mysql");
const inquirer = require("inquirer");
const { up } = require("inquirer/lib/utils/readline");
const { type } = require("os");
const { restoreDefaultPrompts } = require("inquirer");

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
          "Add employees",
          "View Department",
          "View Roles",
          "View Employees",
          "Update Employee roles",
          "Exit",
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
      if (res.type === "Add employees") {
        connection.query(
          "SELECT role_id, manager_id FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id;",
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
                  message: "What is the employees  role id?",
                  choices: function () {
                    return results.map((employee) => employee.role_id);
                  },
                },
                {
                  type: "list",
                  name: "manager",
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
      if (res.type === "View Department") {
        connection.query("SELECT name FROM department;", function (err, data) {
          if (err) throw err;
          console.table(data);
          askQuestions();
        });
      }
      if (res.type === "View Roles") {
        connection.query(
          "SELECT title, salary, name FROM role LEFT JOIN department ON department.id = role.department_id;",
          function (err, data) {
            if (err) throw err;
            console.table(data);
            askQuestions();
          }
        );
      }
      if (res.type === "View Employees") {
        connection.query(
          "SELECT first_name, last_name, title, name FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id;",
          function (err, data) {
            if (err) throw err;
            console.table(data);
            askQuestions();
          }
        );
      }
      if (res.type === "Update Employee roles") {
        connection.query(
          "SELECT first_name, last_name, role_id, salary, manager_id FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id;",
          function (err, data) {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  type: "list",
                  message: "What Employee needs updated",
                  choices: function () {
                    return data.map((role) => role.first_name);
                  },
                  name: "name",
                },
                {
                  type: "list",
                  message: "What is the new role?",
                  choices: function () {
                    return data.map((role) => role.role_id);
                  },
                  name: "role",
                },
              ])
              .then((res2) => {
                updateEmply(res2);
              });
          }
        );
      }
      if (res.type === "Exit") {
        connection.end();
      }
    });
}

function createNewDepart(data) {
  connection.query(
    "INSERT INTO department SET ?",
    [data.depart],
    function (err, res) {
      if (err) throw err;
      console.log("Updated departments.");
      render();
    }
  );
}

function createNewRole(data) {
  connection.query("INSERT INTO role SET ?", [data.role], function (err, res) {
    if (err) throw err;
    console.log("Updated roles.");
    render();
  });
}

function createNewEmply(data) {
  connection.query(
    "INSERT INTO employee SET ?",
    {
      first_name: data.first,
      last_name: data.last,
      role_id: data.role,
      manager_id: data.manager,
    },
    function (err, res) {
      if (err) throw err;
      console.log("Updated departments.");
      render();
    }
  );
}

function updateEmply(res2) {
  connection.query(
    "UPDATE employee SET ? WHERE ?",
    [
      {
        role_id: res2.role,
      },
      {
        first_name: res2.name,
      },
    ],
    function (err, data) {
      if (err) throw err;
      render();
    }
  );
}
