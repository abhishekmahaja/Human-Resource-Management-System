import express from 'express';
const router = express.Router();
import { verifyUser, authorize } from '../middleware/authMiddleware.js';
import { getAllProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';

// Protect routes and authorize based on roles
router.get('/', verifyUser, authorize('admin'), getAllProjects);
router.post('/', verifyUser, authorize('admin'), createProject);
router.put('/:id', verifyUser, authorize('admin'), updateProject);
router.delete('/:id', verifyUser, authorize('admin'), deleteProject);

export default router;
