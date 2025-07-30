// leaveController.js
import LeaveRequest from "../models/LeaveRequest.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

// Request leave
const requestLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    // Get employee ID from the authenticated user
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const leaveRequest = new LeaveRequest({
      employee: employee._id,
      startDate,
      endDate,
      reason,
    });

    const createdLeaveRequest = await leaveRequest.save();
    res.status(201).json(createdLeaveRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get leave requests for the logged-in employee
const getMyLeaveRequests = async (req, res) => {
  try {
    // Get employee ID from the authenticated user
    const employee = await Employee.findOne({ user: req.user.id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const leaveRequests = await LeaveRequest.find({
      employee: employee._id,
    }).sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all leave requests (Admin only)
const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({})
      .populate("employee", "name")
      .sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update leave request status (Admin only)
const updateLeaveRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const leaveRequest = await LeaveRequest.findById(id);

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leaveRequest.status = status;
    await leaveRequest.save();

    res.json(leaveRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  requestLeave,
  getMyLeaveRequests,
  getAllLeaveRequests,
  updateLeaveRequestStatus,
};
