const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "mysqlnigel@1973",
        database: "books_db",
    },
    console.log(`Connected to the books_db database.`)
);

function init() {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "What would you likt to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
            ],
        },
    ]);
}

init();

function viewDepartments() {
    const sql = `SELECT * FROM department;`;
}

function viewRoles() {}

function viewEmployees() {}

function AddEmployee() {}

function updateRole() {}

function addDepartment() {}
