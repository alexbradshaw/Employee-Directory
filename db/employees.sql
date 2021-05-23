drop database if exists employees_db;
create database employees_db;

USE employees_db;

CREATE TABLE departments (
  id INT AUTO_INCREMENT,
  department VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary VARCHAR(30) NOT NULL,
  department_id int NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id int NOT NULL,
  manager_id INT,
  PRIMARY KEY (id)
);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Emerson","Bradshaw",1,2), ("Sentia","Lindix",2, 4), ("Rhonda","Sequal",3,2), ('Jacob', 'Merth',2, null);

INSERT INTO roles (title, salary, department_id)
VALUES ("Accounting",100000,1), ("Developer",150000,2), ("Underwriter",200000,3);

INSERT INTO departments (department)
VALUES ("Finance"), ("Developing"), ("Legal");