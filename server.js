const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "mysqlnigel@1973",
        database: "employee_db",
    },
    console.log(`Connected to the employee_db.`)
);

function menu() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "menu",
                message: "What would you likt to do?\n",
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
        ])
        .then((job) => {
            console.log(job.menu);
            switch (job.menu) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                default:
                // code block
            }
        });
}

menu();

function viewAllDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, results) => {
        if (err) throw err;

        console.table(results);
        menu();
    });
}

function viewAllRoles() {
    const sql = `SELECT role.id, role.title, department.name as department, role.salary FROM role JOIN department ON department.id = role.id`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        menu();
    });
}

function viewEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(employee.first_name, " ", employee.last_name) AS manager
    FROM employee
    LEFT JOIN role 
    ON employee.role_id = role.id 
    LEFT JOIN department
    ON department.id = role.id
`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        menu();
    });
}

function AddEmployee() {}

function updateRole() {}

function addDepartment() {}
