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
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateRole();
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
    const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
      ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
      ON m.id = e.manager_id
`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        console.table(results);
        menu();
    });
}

function addEmployee() {
    db.query(` select  title, id from role`, (err, result) => {
        db.query(
            `select * from employee where manager_id is null;`,
            (err, manager) => {
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "empFirstName",
                            message: "What is the employee's first name?",
                        },
                        {
                            type: "input",
                            name: "empLastName",
                            message: "What is the employee's last name?",
                        },
                        {
                            type: "list",
                            name: "empRole",
                            message: "What is the employee's role?",
                            choices: result.map((data) => ({
                                name: data.title,
                                value: data.id,
                            })),
                        },
                        {
                            type: "list",
                            name: "empManager",
                            message: "Who is the employee's manager?",
                            choices: manager.map((data) => ({
                                name: data.first_name + " " + data.last_name,
                                value: data.id,
                            })),
                        },
                    ])
                    .then(
                        ({
                            empFirstName,
                            empLastName,
                            empRole,
                            empManager,
                        }) => {
                            const params = [
                                empFirstName,
                                empLastName,
                                empRole,
                                empManager,
                            ];

                            console.log(params);
                            const sql =
                                "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)";

                            db.query(sql, params, (err, results) => {
                                if (err) throw err;
                                console.log(`Added ${params} to the database`);
                                menu();
                            });
                        }
                    );
            }
        );
    });
}

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
                menu();
            });
        });
}

function updateRole() {
    db.query(
        " SELECT first_name, last_name, id FROM employee",
        (err, result) => {
            db.query("SELECT id, title, salary FROM role", (err, newRole) => {
                inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "currentRole",
                            message:
                                "Which employee's role do you want to update?",
                            choices: result.map((data) => ({
                                name: data.first_name + " " + data.last_name,
                                value: data.id,
                            })),
                        },
                        {
                            type: "list",
                            name: "assigedRole",
                            message:
                                "Which role do you want to assign the selected employee?",
                            choices: newRole.map((data) => ({
                                name: data.title,
                                value: data.id,
                            })),
                        },
                    ])
                    .then((data) => {
                        console.log(data.currentRole);
                        db.query(
                            `UPDATE employee SET  role_id = ${data.assigedRole} WHERE id = ${data.currentRole}`,
                            (err, result) => {
                                if (err) throw err;
                                console.log(`Role Updated in data database`);
                                menu();
                            }
                        );
                    });
            });
        }
    );
}
