// required
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const cTable = require('console.table');
let db;

// show listed employees
async function getEmployeeList() {
    try {
        const results = await db.execute('SELECT * FROM employee');
        return results[0];
    } catch (err) {
        console.error(err);
    }
}

// show roles list
async function getRoleList() {
    try {
        const results = await db.execute('SELECT * FROM role');
        return results[0];
    } catch (err) {
        console.error(err);
    }
}

// show departments list
async function getDeptList() {
    try {
        const results = await db.execute('SELECT * FROM department');
        return results[0];
    } catch (err) {
        console.error(err);
    }
}

// gives employee new assigned role
async function updateEmployee() {
    const roleChoices = await getRoleList();
    const roleTitles = [];
    roleChoices.forEach(role => roleTitles.push(role.title));

    const employeeChoices = await getEmployeeList();
    const employeeNames = [];
    employeeChoices.forEach(employee => employeeNames.push(employee.first_name + " " + employee.last_name));

    if (employeeNames.length === 0) {
        console.log('Please add employee to start.');
        showMenu();
    } else {
        const updateEmployeeQ = [
            {
                type: 'list',
                message: 'Which employee\'s role do you want to change?',
                choices: employeeNames,
                name: 'employee'
            },
            {
                type: 'list',
                message: 'Which new role would you like to give to this employee?',
                choices: roleTitles,
                name: 'updatedRole'
            }
        ];

        inquirer
            .prompt(updateEmployeeQ)
            .then(async (data) => {
                let employeeID;
                employeeChoices.forEach(employee => {
                    let employeeFullName = employee.first_name + " " + employee.last_name;
                    if (employeeFullName === data.employee) {
                        employeeID = employee.id;
                    }
                });

                let updatedRoleID;
                roleChoices.forEach(role => {
                    if (role.title === data.updatedRole) {
                        updatedRoleID = role.id;
                    }
                });

                try {
                    const result = await db.execute('UPDATE employee SET role_id = ? WHERE id = ?', [updatedRoleID, employeeID]);
                    console.log(`${data.employee}'s role has been changed to ${data.updatedRole}!\n`);
                    showMenu();
                } catch (err) {
                    console.error(err);
                }
            });
    }
}

// allows ability to add employee to table
async function addEmployee() {
    const deptChoices = await getDeptList();
    const deptNames = [];
    deptChoices.forEach(dept => deptNames.push(dept.name));

    const roleChoices = await getRoleList();
    const roleTitles = [];
    roleChoices.forEach(role => roleTitles.push(role.title));

    const employeeChoices = await getEmployeeList();
    const employeeNames = [];
    employeeChoices.forEach(employee => employeeNames.push(employee.first_name + " " + employee.last_name));
    
    // blocks employee adding if length is 0 with department and role amount
    if (deptNames.length === 0 && roleTitles.length === 0) {
        console.log('No departments or roles exist yet. Please add at least one department first, and then add at least one role.');
        showMenu();
    } else if (roleTitles.length === 0) {
        console.log('No roles exist yet. Please add at least one role first.');
        showMenu();
    } else {
        employeeNames.push('None');

        const addEmployeeQ = [
            {
                type: 'input',
                message: 'Enter the employee\'s first name:',
                name: 'firstName'
            },
            {
                type: 'input',
                message: 'Enter the employee\'s last name:',
                name: 'lastName'
            },
            {
                type: 'list',
                message: 'Select the employee\'s role:',
                choices: roleTitles,
                name: 'role'
            },
            {
                type: 'list',
                message: 'Select the name of the employee\'s manager:',
                choices: employeeNames,
                name: 'managerName'
            }
        ];

        inquirer
            .prompt(addEmployeeQ)
            .then(async (data) => {
                let roleID;
                roleChoices.forEach(role => {
                    if (role.title === data.role) {
                        roleID = role.id;
                    }
                });

                let managerID = null;
                if (data.managerName !== 'None') {
                    employeeChoices.forEach(employee => {
                        let employeeFullName = employee.first_name + " " + employee.last_name;
                        if (employeeFullName === data.managerName) {
                            managerID = employee.id;
                        }
                    });
                }
            
                try {
                    const result = await db.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.firstName, data.lastName, roleID, managerID]);
                    console.log(`${data.firstName + " " + data.lastName} was added as an employee to the database!`);
                    showMenu();
                } catch (err) {
                    console.error(err);
                }
            });
    }
}

// allows ability to add role
async function addRole() {
    const deptChoices = await getDeptList();
    const deptNames = [];
    deptChoices.forEach(dept => deptNames.push(dept.name));
    
    // blocks adding role when department length equals 0
    if (deptNames.length === 0) {
        console.log('Please add department to start.');
        showMenu();
    } else {
        const addRoleQ = [
            {
                type: 'input',
                message: 'Enter the name of the role:',
                name: 'roleName'
            },
            {
                type: 'input',
                message: 'Enter the salary of the role:',
                name: 'salary'
            },
            {
                type: 'list',
                message: 'Enter the department that the role belongs to:',
                choices: deptNames,
                name: 'department'
            }
        ];

        inquirer
            .prompt(addRoleQ)
            .then(async (data) => {
                let deptID;
                deptChoices.forEach(dept => {
                    if (dept.name === data.department) {
                        deptID = dept.id;
                    }
                });

                try {
                    const result = await db.execute('INSERT INTO role (title, department_id, salary) VALUES (?, ?, ?)', [data.roleName, deptID, data.salary]);
                    console.log(`${data.roleName} role was added to the database`);
                    showMenu();
                } catch (err) {
                    console.error(err);
                }
            });
    }
}

// allows ability to add department
function addDept() {
    const addDeptQ = [
        {
            type: 'input',
            message: 'Enter the name of the department:',
            name: 'deptName'       
        }
    ];

    inquirer
        .prompt(addDeptQ)
        .then(async (data) => {
            try {
                const results = await db.execute('INSERT INTO department (name) VALUES (?)', [data.deptName]);
                console.log(`${data.deptName} department was added to the database`);
                showMenu();
            } catch (err) {
                console.error(err);
            }
        });
}

// allows full employee list to be viewed
async function viewEmployees() {
    try {
        const result = await db.execute(`SELECT emp1.id AS 'ID', emp1.first_name AS 'FIRST NAME', emp1.last_name AS 'LAST NAME', 
                                    role.title AS 'TITLE', department.name AS 'DEPARTMENT', salary AS 'SALARY', IF(ISNULL(emp1.manager_id), 'null', CONCAT_WS(' ', emp2.first_name, emp2.last_name)) AS 'MANAGER' 
                                    FROM employee AS emp1 LEFT JOIN employee AS emp2 ON emp1.manager_id = emp2.id JOIN role ON emp1.role_id = role.id 
                                    JOIN department ON role.department_id = department.id ORDER BY ID`);

        if (result[0].length === 0) {
            console.log('No employees added yet.');
        } else {
            console.table('EMPLOYEES', result[0]);
        }
        showMenu();
    } catch (err) {
        console.error(err);
    }
}

// allows full roles list to be viewed
async function viewRoles() {
    try {
        const result = await db.execute('SELECT role.id AS `ID`, title AS `TITLE`, department.name AS `DEPARTMENT`, salary AS `SALARY` FROM role JOIN department ON role.department_id = department.id');

        if (result[0].length === 0) {
            console.log('No roles added yet.');
        } else {
            console.table('ROLES', result[0]);
        }
        showMenu();
    } catch (err) {
        console.error(err);
    }
}

// allows full departments list to be viewed
async function viewDepts() {
    try {
        const result = await db.execute('SELECT id AS `ID`, name AS `NAME` FROM department');

        if (result[0].length === 0) {
            console.log('No departments added yet.');
        } else {
            console.table('DEPARTMENTS', result[0]);
        }
        showMenu();
    } catch (err) {
        console.error(err);
    }
}

// menu select
function showMenu() {
    const menuQ = [
        {
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit'],
            name: 'action'
        }
    ];
    
    // assigns functions to menu select
    inquirer
        .prompt(menuQ)
        .then(menuA => {
            if (menuA.action === 'View all departments') {
                viewDepts();
            } else if (menuA.action === 'View all roles') {
                viewRoles();
            } else if (menuA.action === 'View all employees') {
                viewEmployees();
            } else if (menuA.action === 'Add a department') {
                addDept();
            } else if (menuA.action === 'Add a role') {
                addRole();
            } else if (menuA.action === 'Add an employee') {
                addEmployee();
            } else if (menuA.action === 'Update an employee role') {
                updateEmployee();
            } else if (menuA.action === 'Quit') {
                console.log('Goodbye!');  
                process.exit();    
            }
        });
}

// mysql info
async function init() {
    try {
        db = await mysql.createConnection(
            {
                host: 'localhost',
                user: 'root',
                password: 'Smoc1234!',
                database: 'company_db'
            }
        );

        console.log('Welcome to the Employee Tracker!');
        showMenu();
    } catch (err) {
        console.error(err);
    }
}

init();