import express from 'express';
const router = express.Router();
import { requestLeave, getMyLeaveRequests, updateLeaveRequestStatus, getAllLeaveRequests } from '../controllers/leaveController.js';
import { verifyUser, verifyAdmin } from '../middleware/authMiddleware.js';

router.post('/request', verifyUser, requestLeave);
router.get('/my-requests', verifyUser, getMyLeaveRequests);
router.get('/all-requests', verifyUser, verifyAdmin, getAllLeaveRequests); 
router.put('/requests/:id', verifyUser, verifyAdmin, updateLeaveRequestStatus); 

export { router as leaveRouter };