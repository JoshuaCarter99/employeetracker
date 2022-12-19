INSERT INTO department (name, id)
VALUES ('Engineering', 1),
       ('Finance', 2),
       ('Legal', 3),
       ('Sales', 4);

INSERT INTO role (title, department_id, salary, id)
VALUES ('Engineer', 1, 80000, 10),
       ('Lead Engineer', 1, 100000, 15),
       ('Accountant', 2, 125000, 20),
       ('Lead Accountant', 2, 150000, 25),
       ('Lawyer', 3, 150000, 30),
       ('Sales Analyst', 4, 80000, 40),
       ('Lead Sales Analyst', 4, 100000, 45);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Dale', 'Cooper', 15, null),
       ('Benjamin', 'Horne', 25, null),
       ('Windom', 'Earle', 45, null),
       ('Leland', 'Palmer', 30, null),
       ('Harry S.', 'Truman', 10, 1),
       ('Shelly', 'Johnson', 20, 2),
       ('Bobby', 'Briggs', 20, 2),
       ('Audrey', 'Horne', 20, 2),
       ('James', 'Hurley', 40, 3),
       ('Lucy', 'Moran', 10, 1),
       ('Tommy', 'Hill', 10, 1),
       ('Leo', 'Johnson', 40, 3),
       ('Garland', 'Briggs', 40, 3);