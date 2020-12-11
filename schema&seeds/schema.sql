DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
  id INT AUTO_INCREMENT PRIMARY KEY
, name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
  id INT AUTO_INCREMENT PRIMARY KEY
, title varchar(30) NOT NULL
, salary float NOT NULL
, department_id int NOT NULL
, foreign key (department_id) references department(id)
);

CREATE TABLE employee(
  id INT AUTO_INCREMENT PRIMARY KEY
, first_name varchar(30) NOT NULL
, last_name varchar(30) NOT NULL
, role_id INT NOT NULL
, manager_id INT
, foreign key (manager_id) references role(id)
, foreign key (role_id) references role(id)
);