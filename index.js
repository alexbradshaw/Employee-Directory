const inq = require('inquirer')
const mysql = require('mysql')
const cTable = require('console.table')
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
});


function start() {
    // start function so we can loop through the directory multiple times
    inq
        .prompt([
            {
                name: 'init',
                message: 'What would you like to do?',
                type: 'list',
                choices: ['Add Departments', 'Add Roles', 'Add Employees', 'View Departments', 'View Roles', 'View Employees', 'Update Employee', 'Exit']
            }])
        .then(answers => {
            console.log(answers.init);
            switch (answers.init) {
                case 'Exit':
                    process.exit()
                case 'Add Departments':
                    addDepart()
                    break
                case 'Add Roles':
                    addRoles()
                    break
                case 'Add Employees':
                    addEmps()
                    break
                case 'View Departments':
                    viewDepart()
                    break
                case 'View Roles':
                    viewRoles()
                    break
                case 'View Employees':
                    viewEmps()
                    break
                case 'Update Employee':
                    updateEmp()
                    break
            }



        })
        .catch(err => console.log(err))
}

function addDepart() {
    // function that handles adding departments
}

function addRoles() {
    // function that handles adding roles

}

function addEmps() {
    // function that handles adding employees

}

function viewDepart() {
    // function that handles viewing departments
    connection.query(
        'Select id, name, FROM departments',
        (err, res) => {
            if (err) throw err;
            console.log(res);

        }
    );

}

function viewRoles() {
    // function that handles viewing roles
    connection.query(
        'Select id, title, salary, department_id FROM roles',
        (err, res) => {
            if (err) throw err;
            console.log(res);

        }
    );
}

function viewEmps() {
    // function that handles viewing employees
    connection.query(
        'Select id, first_name, last_name, role_id, manager_id FROM employees',
        (err, res) => {
            if (err) throw err;
            console.log(res);

        }
    );

}

function updateEmp() {
    // function that handles updating employees
    connection.query(
        'Select id, first_name, last_name, role_id, manager_id FROM employees WHERE ?',
        {
            song: data.currentSearch,
        },
        (err, res) => {
            if (err) throw err;
            console.log(res);
            inq
                .prompt([
                    {
                        name: 'init',
                        message: 'What would you like to do?',
                        type: 'list',
                        choices: ['Add Departments', 'Add Roles', 'Add Employees', 'View Departments', 'View Roles', 'View Employees', 'Update Employee', 'Exit']
                    }])
                .then(answers => {
                    console.log(answers);
                    connection.query(
                        'Select id, first_name, last_name, role_id, manager_id FROM employees WHERE ?',
                        {
                            song: data.currentSearch,
                        },
                        (err, res) => {
                            if (err) throw err;
                            console.log(res)
                        }
                    )

                })
        })
    }

    function tableView(res) {
        for (let i = 0; i < res.length; i++) {

        }
        console.table(tableArray)
    }