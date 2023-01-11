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
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
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

function addRole() {
    db.query(`SELECT id, name FROM department`, (err, result) => {
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "name",
                    message: "What is the name of the role?",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?",
                },
                {
                    type: "list",
                    name: "department",
                    message: "which department does the role belong to?",
                    choices: result.map((data) => ({
                        name: data.name,
                        value: data.id,
                    })),
                },
            ])
            .then(({ name, salary, department }) => {
                const params = [name, salary, department];
                const sql =
                    "INSERT INTO role(title,salary, department_id) VALUES(?,?,?)";
                db.query(sql, params, (err, results) => {
                    if (err) throw err;
                    console.log(`Added ${params} to the database`);
                    console.table(results);
                    menu();
                });
            });
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "department",
                message: "Enter name of the department to add?",
            },
        ])
        .then((answer) => {
            const params = answer.department;
            const sql = "INSERT INTO department (name) VALUES(?)";
            db.query(sql, params, (err, results) => {
                if (err) throw err;
                console.log(`Added ${params} to the database`);
                console.table(results);
                menu();
            });
        });
}
