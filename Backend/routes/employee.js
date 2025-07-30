import express from 'express';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeeController.js';
import { verifyUser, authorize } from '../middleware/authMiddleware.js'; // Corrected import

const router = express.Router();

// Protect all employee routes and authorize only admin
router.use(verifyUser); 
router.use(authorize('admin'));

router.route('/').post(createEmployee).get(getAllEmployees);
router
  .route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;