import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]); // Add state for leave requests
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    skills: '',
  });
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    teamMembers: [],
  });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
    if (user && user.role === 'admin') {
      fetchEmployees();
      fetchProjects();
      fetchLeaveRequests(); // Fetch leave requests for admin
    }
  }, [user, loading, navigate]);

  const fetchEmployees = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const { data } = await axios.get('/api/employees', config);
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const { data } = await axios.get('/api/projects', config);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      // Assuming a new endpoint to get all leave requests for admin
      const { data } = await axios.get('/api/leave/all-requests', config);
      setLeaveRequests(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleAddEmployeeChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const skillsArray = newEmployee.skills.split(',').map(skill => skill.trim());
      await axios.post('/api/employees', { ...newEmployee, skills: skillsArray }, config);
      setNewEmployee({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        skills: '',
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleEditEmployeeChange = (e) => {
    setEditingEmployee({ ...editingEmployee, [e.target.name]: e.target.value });
  };

  const handleEditEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const skillsArray = editingEmployee.skills.split(',').map(skill => skill.trim());
      await axios.put(
        `/api/employees/${editingEmployee._id}`,
        { ...editingEmployee, skills: skillsArray },
        config
      );
      setEditingEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await axios.delete(`/api/employees/${employeeId}`, config);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleAddProjectChange = (e) => {
    const { name, value, options } = e.target;
    if (name === 'teamMembers') {
      const selectedOptions = Array.from(options).filter(option => option.selected);
      const selectedValues = selectedOptions.map(option => option.value);
      setNewProject({ ...newProject, [name]: selectedValues });
    } else {
      setNewProject({ ...newProject, [name]: value });
    }
  };

  const handleAddProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await axios.post('/api/projects', newProject, config);
      setNewProject({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        teamMembers: [],
      });
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleEditProjectChange = (e) => {
    const { name, value, options } = e.target;
    if (name === 'teamMembers') {
      const selectedOptions = Array.from(options).filter(option => option.selected);
      const selectedValues = selectedOptions.map(option => option.value);
      setEditingProject({ ...editingProject, [name]: selectedValues });
    } else {
      setEditingProject({ ...editingProject, [name]: value });
    }
  };

  const handleEditProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await axios.put(
        `/api/projects/${editingProject._id}`,
        editingProject,
        config
      );
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await axios.delete(`/api/projects/${projectId}`, config);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Handle leave request status update
  const handleUpdateLeaveStatus = async (requestId, status) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await axios.put(`/api/leave/requests/${requestId}`, { status }, config);
      fetchLeaveRequests(); // Refresh the leave requests list
    } catch (error) {
      console.error('Error updating leave request status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {user && <p>Welcome, {user.name} ({user.role})</p>}

      {/* Employee Management Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Employees</h3>
        <div className="mb-4 p-4 border rounded">
          <h4 className="text-lg font-semibold mb-2">Add New Employee</h4>
          <form onSubmit={handleAddEmployeeSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newEmployee.name}
              onChange={handleAddEmployeeChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={handleAddEmployeeChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newEmployee.password}
              onChange={handleAddEmployeeChange}
              className="border p-2 rounded"
              required
            />
            <select
              name="role"
              value={newEmployee.role}
              onChange={handleAddEmployeeChange}
              className="border p-2 rounded"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              value={newEmployee.skills}
              onChange={handleAddEmployeeChange}
              className="border p-2 rounded col-span-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-2">
              Add Employee
            </button>
          </form>
        </div>

        <ul>
          {employees.map((employee) => (
            <li key={employee._id} className="border rounded p-4 mb-2 flex justify-between items-center">
              <div>
                <h5 className="font-semibold">{employee.name} ({employee.role})</h5>
                <p>{employee.email}</p>
                <p>Skills: {employee.skills.join(', ')}</p>
              </div>
              <div>
                <button
                  onClick={() => setEditingEmployee(employee)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {editingEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-lg w-1/3">
              <h3 className="text-xl font-bold mb-4">Edit Employee</h3>
              <form onSubmit={handleEditEmployeeSubmit} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editingEmployee.name}
                  onChange={handleEditEmployeeChange}
                  className="border p-2 rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editingEmployee.email}
                  onChange={handleEditEmployeeChange}
                  className="border p-2 rounded"
                  required
                />
                <select
                  name="role"
                  value={editingEmployee.role}
                  onChange={handleEditEmployeeChange}
                  className="border p-2 rounded"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  name="skills"
                  placeholder="Skills (comma-separated)"
                  value={editingEmployee.skills.join(', ')}
                  onChange={handleEditEmployeeChange}
                  className="border p-2 rounded col-span-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-2 mr-2">
                  Update Employee
                </button>
                <button type="button" onClick={() => setEditingEmployee(null)} className="bg-gray-500 text-white p-2 rounded col-span-2">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Project Management Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Projects</h3>
        <div className="mb-4 p-4 border rounded">
          <h4 className="text-lg font-semibold mb-2">Add New Project</h4>
          <form onSubmit={handleAddProjectSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={newProject.name}
              onChange={handleAddProjectChange}
              className="border p-2 rounded"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newProject.description}
              onChange={handleAddProjectChange}
              className="border p-2 rounded col-span-2"
            ></textarea>
            <input
              type="date"
              name="startDate"
              value={newProject.startDate}
              onChange={handleAddProjectChange}
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="endDate"
              value={newProject.endDate}
              onChange={handleAddProjectChange}
              className="border p-2 rounded"
            />
            <div>
              <label htmlFor="teamMembers" className="block text-sm font-medium text-gray-700">Team Members</label>
              <select
                id="teamMembers"
                name="teamMembers"
                multiple
                value={newProject.teamMembers}
                onChange={handleAddProjectChange}
                className="border p-2 rounded w-full"
              >
                {employees.map(employee => (
                  <option key={employee._id} value={employee._id}>{employee.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-2">
              Add Project
            </button>
          </form>
        </div>

        <ul>
          {projects.map((project) => (
            <li key={project._id} className="border rounded p-4 mb-2 flex justify-between items-center">
              <div>
                <h5 className="font-semibold">{project.name}</h5>
                <p>{project.description}</p>
                {project.startDate && <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>}
                {project.endDate && <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>}
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <p>Team Members: {project.teamMembers.map(member => member.name).join(', ')}</p>
                )}
              </div>
              <div>
                <button
                  onClick={() => setEditingProject(project)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {editingProject && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-lg w-1/3">
              <h3 className="text-xl font-bold mb-4">Edit Project</h3>
              <form onSubmit={handleEditProjectSubmit} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Project Name"
                  value={editingProject.name}
                  onChange={handleEditProjectChange}
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={editingProject.description}
                  onChange={handleEditProjectChange}
                  className="border p-2 rounded col-span-2"
                ></textarea>
                <input
                  type="date"
                  name="startDate"
                  value={editingProject.startDate ? editingProject.startDate.substring(0, 10) : ''}
                  onChange={handleEditProjectChange}
                  className="border p-2 rounded"
                />
                <input
                  type="date"
                  name="endDate"
                  value={editingProject.endDate ? editingProject.endDate.substring(0, 10) : ''}
                  onChange={handleEditProjectChange}
                  className="border p-2 rounded"
                />
                <div>
                  <label htmlFor="editTeamMembers" className="block text-sm font-medium text-gray-700">Team Members</label>
                  <select
                    id="editTeamMembers"
                    name="teamMembers"
                    multiple
                    value={editingProject.teamMembers.map(member => member._id)}
                    onChange={handleEditProjectChange}
                    className="border p-2 rounded w-full"
                  >
                    {employees.map(employee => (
                      <option key={employee._id} value={employee._id}>{employee.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-2 mr-2">
                  Update Project
                </button>
                <button type="button" onClick={() => setEditingProject(null)} className="bg-gray-500 text-white p-2 rounded col-span-2">
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Leave Request Management Section (Admin) */}
      {user && user.role === 'admin' && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Leave Requests</h3>
          {leaveRequests.length === 0 ? (
            <p>No leave requests submitted yet.</p>
          ) : (
            <ul>
              {leaveRequests.map(request => (
                <li key={request._id} className="border rounded p-4 mb-2 flex justify-between items-center">
                  <div>
                    <p><strong>Employee:</strong> {request.employee ? request.employee.name : 'N/A'}</p>
                    <p><strong>Dates:</strong> {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</p>
                    <p><strong>Reason:</strong> {request.reason}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                  </div>
                  {request.status === 'pending' && (
                    <div>
                      <button
                        onClick={() => handleUpdateLeaveStatus(request._id, 'approved')}
                        className="bg-green-500 text-white p-2 rounded mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateLeaveStatus(request._id, 'rejected')}
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
