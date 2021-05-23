const inq = require('inquirer')
const mysql = require('mysql')
const cTable = require('console.table')
require('dotenv').config({ path: '.env' });

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
    start()
});

function startConnection() {
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
    });
    return connection
}

function start() {
    startConnection()
    // start function so we can loop through the directory multiple times
    inq
        .prompt([
            {
                name: 'init',
                message: 'What would you like to do?',
                type: 'list',
                choices: ['Add Departments', 'Add Roles', 'Add Employees', 'View Departments', 'View Roles', 'View Employees', 'Update Employee','View By Manager', 'Exit']
            }])
        .then(answers => {
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
                case 'View By Manager':
                    viewByMan()
                    break
            }



        })
        .catch(err => console.error(err))
}

function addDepart() {
    // function that handles adding departments
    inq
        .prompt([
            {
                name: 'departName',
                message: 'What is the name of your department?',
                type: 'input',
            }
        ])
        .then(resp => {
            connection.query(
                'INSERT INTO departments SET ?',
                {
                    department: resp.departName
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`\n\t\t Department Created`);
                    console.log('-------------------------------------------------\n');
                    start()
                }
            );
        })
        .catch(err => console.error(err))
}

function addRoles() {
    // function that handles adding roles
    connection.query(
        'Select department FROM departments',
        (err, res) => {
            var departmentArray = []
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                departmentArray.push(res[i].department)
            }
            inq
                .prompt([
                    {
                        name: 'title',
                        message: 'What is the name of your role?',
                        type: 'input',
                    },
                    {
                        name: 'salary',
                        message: 'What is the salary of your role?',
                        type: 'input'
                    },
                    {
                        name: 'depart',
                        message: 'What department does this role belong to?',
                        type: 'list',
                        choices: departmentArray
                    },
                ])
                .then(resp => {
                    for (let i = 0; i < departmentArray.length; i++) {
                        if (departmentArray[i] === resp.depart) {
                            var a = i + 1
                        }
                    }
                    connection.query(
                        'INSERT INTO roles SET ?',
                        {
                            title: resp.title,
                            salary: resp.salary,
                            department_id: a,
                        },
                        (err, res) => {
                            if (err) throw err;
                            console.log(`\n\t\t Role Added`);
                            console.log('-------------------------------------------------\n');
                            start()
                        }
                    )
                })
                .catch(err => console.error(err))
        }
    )
}

function addEmps() {
    // function that handles adding employees
    connection.query(
        'Select first_name FROM employees',
        (err, res) => {
            var nameArray = []
            for (let i = 0; i < res.length; i++) {
                nameArray.push(res[i].first_name)
            }
            connection.query(
                'Select title FROM roles',
                (err, res) => {

                    var roleArray = []
                    if (err) throw err;
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title)
                    }
                    nameArray.push('None')
                    inq
                        .prompt([
                            {
                                name: 'first_name',
                                message: 'What is the first name of your employee?',
                                type: 'input',
                            },
                            {
                                name: 'last_name',
                                message: 'What is the last name of your employee?',
                                type: 'input'
                            },
                            {
                                name: 'role',
                                message: 'What is the name of your employee\'s role?',
                                type: 'list',
                                choices: roleArray
                            },
                            {
                                name: 'manager',
                                message: 'Who is your employee\'s manager?',
                                type: 'list',
                                choices: nameArray
                            },
                        ])
                        .then(resp => {
                            for (let i = 0; i < roleArray.length; i++) {
                                if (roleArray[i] === resp.role) {
                                    var b = i + 1
                                }
                            }
                            for (let i = 0; i < nameArray.length; i++) {
                                if (nameArray[i] === resp.manager) {
                                    var a = i + 1
                                }
                            }
                            connection.query(
                                'INSERT INTO employees SET ?',
                                {
                                    first_name: resp.first_name,
                                    last_name: resp.last_name,
                                    role_id: b,
                                    manager_id: a
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.log(`\n\t\t Employee Added`);
                                    console.log('-------------------------------------------------\n');
                                    start()
                                }
                            )
                        })
                        .catch(err => console.error(err))
                }
            )
        })
}

function viewDepart() {
    // function that handles viewing departments
    connection.query(
        'Select id, department FROM departments',
        (err, res) => {
            if (err) throw err;
            console.log(`\n`);
            console.table(res);
            console.log('-------------------------------------------------\n');
            start()
        }
    );

}

function viewRoles() {
    // function that handles viewing roles
    connection.query(
        `SELECT roles.title, roles.salary, departments.department
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id;`,
        (err, res) => {
            if (err) throw err;
            console.log(`\n`);
            console.table(res);
            console.log('-------------------------------------------------\n');
            start()
        }
    );
}

function viewEmps() {
    // function that handles viewing employees
    connection.query(
        `SELECT s1.first_name, s1.last_name, s2.first_name as manager, roles.title
        FROM employees s1
        left JOIN employees s2 
        ON s1.manager_id=s2.id 
        LEFT JOIN roles
        ON s1.role_id = roles.id;`,
        (err, res) => {
            if (err) throw err;
            console.log(`\n`);
            console.table(res);
            console.log('-------------------------------------------------\n');
            start()
        }
    );

}

function viewByMan() {
    connection.query(
        'Select first_name FROM employees',
        (err, res) => {
            var nameArray = []
            for (let i = 0; i < res.length; i++) {
                nameArray.push(res[i].first_name)
            }
            inq
                .prompt([
                    {
                        name: 'manager',
                        message: 'What manager would you like to search by?',
                        type: 'list',
                        choices: nameArray
                    },
                ])
                .then(resp => {
                    connection.query(
                        `SELECT s1.first_name, s1.last_name
                FROM employees s1
                left JOIN employees s2 
                ON s1.manager_id=s2.id
                where s2.first_name = '${resp.manager}'`,
                        (err, res) => {
                            if (err) throw err;
                            if (res[0] === undefined) {
                                console.log('\n\t\t No Results Found\n\n -------------------------------------------------\n');
                            } else {
                                console.log(`\n`);
                                console.table(res);
                                console.log('-------------------------------------------------\n');
                            }
        
                            start()
                        }
                    )
                })
                .catch(err => console.error(err))
        })
}



function updateEmp() {
    // function that handles updating employees
    connection.query(
        'Select first_name FROM employees',
        (err, res) => {
            if (err) throw err;
            const displayArray = []
            for (let i = 0; i < res.length; i++) {
                displayArray.push(res[i].first_name)
            }
            inq
                .prompt([
                    {
                        name: 'init',
                        message: 'Who would you like to update?',
                        type: 'list',
                        choices: displayArray
                    }
                ])
                .then(answers => {
                    console.log(answers);
                    connection.query(
                        'Select id, first_name, last_name, role_id, manager_id FROM employees WHERE ?',
                        {
                            first_name: answers.init,
                        },
                        (err, res) => {
                            if (err) throw err;
                            inq
                                .prompt([
                                    {
                                        name: 'upda',
                                        message: `What would you like to update on ${answers.init}?`,
                                        type: 'list',
                                        choices: ['First Name', 'Last Name', 'Role', 'Manager']
                                    }
                                ])
                                .then(resp => {
                                    // tried a lot of ways to try and get this to work but the only way that would is making two separate inq prompts soo
                                    if (resp.upda === 'Role' || resp.upda === 'Manager') {
                                        if (resp.upda === 'Role') {
                                            connection.query(
                                                'Select title FROM roles',
                                                (err, res) => {
                                                    var idArray = []
                                                    if (err) throw err;
                                                    for (let i = 0; i < res.length; i++) {
                                                        idArray.push(res[i].title)
                                                    }
                                                    finalQuestion(answers, resp, idArray)
                                                }
                                            )
                                        } else if (resp.upda === 'Manager') {
                                            connection.query(
                                                'Select first_name FROM employees',
                                                (err, res) => {
                                                    var idArray = []
                                                    if (err) throw err;
                                                    for (let i = 0; i < res.length; i++) {
                                                        idArray.push(res[i].first_name)
                                                    }
                                                    idArray.push('None')
                                                    finalQuestion(answers, resp, idArray)
                                                }

                                            )
                                        }
                                    } else {
                                        inq
                                            .prompt(
                                                {
                                                    name: 'updatedItem',
                                                    message: `What would you like ${answers.init}'s new ${resp.upda} to be?`,
                                                    type: 'input'
                                                })
                                            .then(finalRes => {
                                                switch (resp.upda) {
                                                    case 'First Name': {
                                                        var choice = 'first_name'
                                                        break
                                                    }
                                                    case 'Last Name': {
                                                        var choice = 'last_name'
                                                        break
                                                    }
                                                    case 'Role': {
                                                        var choice = 'role_id'
                                                        break
                                                    }
                                                    case 'Manager': {
                                                        var choice = 'manager_id'
                                                        break
                                                    }
                                                }
                                                connection.query(
                                                    `UPDATE employees SET ${choice} = '${finalRes.updatedItem}' WHERE employees.first_name = '${answers.init}'`,
                                                    (err, res) => {
                                                        if (err) throw err;
                                                        console.log(`-------------------------------------------------\n\n\t\tItems Updated!\n\n-------------------------------------------------\n`);
                                                        start()
                                                    }
                                                )

                                            })
                                            .catch(err => console.error(err))
                                    }
                                })
                                .catch(err => console.error(err))
                        }
                    )
                })
                .catch(err => console.error(err))
        })
}

function finalQuestion(answers, resp, idArray) {
    inq
        .prompt(
            {
                name: 'updatedItem',
                message: `What would you like ${answers.init}'s new ${resp.upda} to be?`,
                type: 'list',
                choices: idArray
            })
        .then(finalRes => {
            switch (resp.upda) {
                case 'First Name': {
                    var choice = 'first_name'
                    break
                }
                case 'Last Name': {
                    var choice = 'last_name'
                    break
                }
                case 'Role': {
                    var choice = 'role_id'
                    break
                }
                case 'Manager': {
                    var choice = 'manager_id'
                    break
                }
            }
            for (let i = 0; i < idArray.length; i++) {
                if (idArray[i] === finalRes.updatedItem) {
                    var a = i + 1
                }
            }
            if (answers.init)
                connection.query(
                    `UPDATE employees SET ${choice} = ${a} WHERE employees.first_name = '${answers.init}'`,
                    (err, res) => {
                        if (err) throw err;
                        console.log(`-------------------------------------------------\n\n\t\tItems Updated!\n\n-------------------------------------------------\n`);
                        start()
                    }
                )

        })
        .catch(err => console.error(err))
}

// connection.query(
//     'Select id, first_name, last_name, role_id, manager_id FROM employees WHERE ?',
//     {
//         song: data.currentSearch,
//     },

// (err, res) => {
//     if (err) throw err;
//     console.log(`\n`);
//     console.table(res);
//     console.log('-------------------------------------------------\n');
//     start()
// }