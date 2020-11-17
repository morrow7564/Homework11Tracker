const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db/index");
require("console.table");

init();


function init() {
  const logoText = logo({ name: "Employee Tracker Table" }).render();

  console.log(logoText);

  MainPrompts();
}

async function MainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name:'View all departments',
          value:'VIEW_DEPARTMENTS'
      },
      {
          name:'View all roles',
          value:'VIEW_ROLES',
      },
      {
          name:'Add an employee',
          value:'ADD_EMPLOYEE'
      },
      {
          name:'Add a role',
          value:'ADD_ROLE'
      },
      {
          name:'Add a department',
          value:'ADD_DEPARTMENT'
      },
      {
          name:'Update employee role',
          value:'UPDATE_EMPLOYEE_ROLE'
      },
      {
        name: "Remove Employee",
        value: "REMOVE_EMPLOYEE"
      },
        {
          name: "Exit",
          value: "Exit"
        }
      ]
    }
  ]);

 
  switch (choice) {
    case 'VIEW_EMPLOYEES': return viewEmployees();
        case 'VIEW_DEPARTMENTS': return viewDepartments();
        case 'VIEW_ROLES': return viewAllRoles()
        case 'ADD_EMPLOYEE' : return addEmployee();
        case 'ADD_DEPARTMENT': return addDepartment();
        case 'ADD_ROLE': return addRole();
        case 'UPDATE_EMPLOYEE_ROLE': return updateRole();
        case "REMOVE_EMPLOYEE": return removeEmployee();
    default: return quit();
  }
}

async function viewEmployees() {
  const res = await db.findAllEmployees();
  console.table(res);
  MainPrompts();
}

async function viewDepartments() {
  const departments = await db.findAllDepartments();

  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id
  }));

  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to see employees for?",
      choices: departmentChoices
    }
  ]);

  const employees = await db.findAllEmployeesByDepartment(departmentId);

  console.log("\n");
  console.table(employees);

  MainPrompts();
}

async function viewAllRoles() {
  const roles = await db.findAllRoles();

  console.log("\n");
  console.table(roles);

  MainPrompts();
}

async function removeEmployee() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Removed employee from the database");

  MainPrompts();
}

async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
    
  ]);
}


async function addRole() {
  const answer = await db.addRole([
    {
      name: "role",
      type: "input",
      message: "What role would you like to add?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary for that role?"
    }
  ]);

  // const res = await db.addRole(answer.role, answer.salary);
  console.log(`Added ${answer.role} to the the database.`);
  MainPrompts();

}


function quit() {
  console.log("Goodbye!");
  process.exit();
}
