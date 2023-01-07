INSERT INTO department(name)
VALUES("Engineering"),
("Finance"),
("Leagal"),
("Sales");

INSERT INTO role(title, salary, department_id)
VALUES("Sofware sales rep", 50000, 4),
("Software engineer", 100000, 1),
("Financial analyst", 120000, 2),
("Design engineer", 110000, 1),
("Lawyer", 150000, 3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Dexter", "Dick", 2, null),
("John", "Doe", 2, 1),
("Ashley", "Rodriguez", 1, null),
("Kevin", "Tupik", 3, 3),
("kunal", "Singh", 1, 1),
("Malia", "Brown", 1, 1),
("Sarah", "Lourd", 4, 3),
("Tom", "Alan", 4, 1),
("Karen", "Dick", 5, 1),
("Heather", "Smith", 1, 1);


