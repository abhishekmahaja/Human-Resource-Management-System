import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js'; // We will create this model next

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
  const { name, description, startDate, endDate, teamMembers } = req.body;

  const projectExists = await Project.findOne({ name });

  if (projectExists) {
    res.status(400);
    throw new Error('Project already exists');
  }

  const project = await Project.create({
    name,
    description,
    startDate,
    endDate,
    teamMembers,
  });

  if (project) {
    res.status(201).json({
      _id: project._id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      teamMembers: project.teamMembers,
    });
  } else {
    res.status(400);
    throw new Error('Invalid project data');
  }
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private/Admin
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({}).populate('teamMembers', 'name email');
  res.json(projects);
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private/Admin
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    'teamMembers',
    'name email'
  );

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.startDate = req.body.startDate || project.startDate;
    project.endDate = req.body.endDate || project.endDate;
    project.teamMembers = req.body.teamMembers || project.teamMembers;

    const updatedProject = await project.save();

    res.json({
      _id: updatedProject._id,
      name: updatedProject.name,
      description: updatedProject.description,
      startDate: updatedProject.startDate,
      endDate: updatedProject.endDate,
      teamMembers: updatedProject.teamMembers,
    });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.remove();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
