INSERT INTO department(name)
VALUES ("Enginering"), ("Sales");

INSERT INTO role(title, salary, department_id)
VAlUEs("Engineer Lead", 150000.00, 1),("Engineer", 90000.00, 1), ("Salesperson", 75000.00, 2), ("SalesLead", 85000.00, 2);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUEs("Logan", "Pippin", 1, 1),("Tom", "Banks", 2, 1),("Lisa", "Fawn", 3, 4),("Tasha", "Fairview", 4, 4);