import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import axios from 'axios';

const EmployeeDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'employee')) {
      navigate('/login');
    }
    if (user && user.role === 'employee') {
      fetchEmployeeData();
      fetchAssignedProjects();
      fetchMyLeaveRequests();
    }
  }, [user, loading, navigate]);

  const fetchEmployeeData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      // Assuming there's an API endpoint to get employee data by user ID
      const { data } = await axios.get(`/api/employees/me`, config);
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

   const fetchAssignedProjects = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      // Assuming there's an API endpoint to get projects assigned to the logged-in employee
      const { data } = await axios.get(`/api/projects/my-projects`, config);
      setAssignedProjects(data);
    } catch (error) {
      console.error('Error fetching assigned projects:', error);
    }
  };

  const fetchMyLeaveRequests = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const { data } = await axios.get('/api/leave/my-requests', config);
      setLeaveRequests(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleLeaveInputChange = (e) => {
    setNewLeaveRequest({ ...newLeaveRequest, [e.target.name]: e.target.value });
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      await axios.post('/api/leave/request', newLeaveRequest, config);
      setNewLeaveRequest({
        startDate: '',
        endDate: '',
        reason: '',
      });
      fetchMyLeaveRequests(); // Refresh the leave requests list
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Employee Dashboard</h2>
      {user && <p>Welcome, {user.name} ({user.role})</p>}

      {/* Employee Details */}
      {employee && (
        <div className="mt-8 p-4 border rounded">
          <h3 className="text-xl font-bold mb-2">My Details</h3>
          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Skills:</strong> {employee.skills.join(', ')}</p>
          {/* Add option to change password later */}
        </div>
      )}

      {/* Assigned Projects */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Assigned Projects</h3>
        {assignedProjects.length === 0 ? (
          <p>No projects assigned yet.</p>
        ) : (
          <ul>
            {assignedProjects.map(project => (
              <li key={project._id} className="border rounded p-4 mb-2">
                <h4 className="font-semibold">{project.name}</h4>
                <p>{project.description}</p>
                {project.startDate && <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>}
                {project.endDate && <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Leave Request Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Leave Requests</h3>

        <div className="mb-4 p-4 border rounded">
          <h4 className="text-lg font-semibold mb-2">Submit New Leave Request</h4>
          <form onSubmit={handleLeaveSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={newLeaveRequest.startDate}
                onChange={handleLeaveInputChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={newLeaveRequest.endDate}
                onChange={handleLeaveInputChange}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
              <textarea
                id="reason"
                name="reason"
                value={newLeaveRequest.reason}
                onChange={handleLeaveInputChange}
                className="border p-2 rounded w-full"
                rows="3"
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Submit Request
            </button>
          </form>
        </div>

        <div className="mt-8">
          <h4 className="text-lg font-semibold mb-2">My Leave Requests</h4>
           {leaveRequests.length === 0 ? (
          <p>No leave requests submitted yet.</p>
        ) : (
          <ul>
            {leaveRequests.map(request => (
              <li key={request._id} className="border rounded p-4 mb-2">
                <p><strong>Dates:</strong> {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</p>
                <p><strong>Reason:</strong> {request.reason}</p>
                <p><strong>Status:</strong> {request.status}</p>
              </li>
            ))}
          </ul>
           )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
