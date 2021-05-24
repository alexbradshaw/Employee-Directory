INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Emerson","Bradshaw",1,2), ("Sentia","Lindix",2, 4), ("Rhonda","Sequal",3,2), ('Jacob', 'Merth',2, null);

INSERT INTO roles (title, salary, department_id)
VALUES ("Accounting",100000,1), ("Developer",150000,2), ("Underwriter",200000,3);

INSERT INTO departments (department)
VALUES ("Finance"), ("Developing"), ("Legal");