import asyncHandler from 'express-async-handler';
import Employee from '../models/Employee.js'; // We will create this model next

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, password, role, skills } = req.body;

  const employeeExists = await Employee.findOne({ email });

  if (employeeExists) {
    res.status(400);
    throw new Error('Employee already exists');
  }

  const employee = await Employee.create({
    name,
    email,
    password,
    role,
    skills,
  });

  if (employee) {
    res.status(201).json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      skills: employee.skills,
    });
  } else {
    res.status(400);
    throw new Error('Invalid employee data');
  }
});

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({});
  res.json(employees);
});

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private/Admin
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    res.json(employee);
  }
else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    employee.name = req.body.name || employee.name;
    employee.email = req.body.email || employee.email;
    employee.role = req.body.role || employee.role;
    employee.skills = req.body.skills || employee.skills;

    const updatedEmployee = await employee.save();

    res.json({
      _id: updatedEmployee._id,
      name: updatedEmployee.name,
      email: updatedEmployee.email,
      role: updatedEmployee.role,
      skills: updatedEmployee.skills,
    });
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (employee) {
    await employee.remove();
    res.json({ message: 'Employee removed' });
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

export {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
