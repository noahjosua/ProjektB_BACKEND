const Project = require('../models/project');
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
require('dotenv').config();
const multler = require('multer');

// Define MIME types for image validation
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// Multer configuration for handling file uploads
const storage = multler.diskStorage({
  destination: (req, file, cb) => {
    // Validate MIME type and set error if invalid
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'images');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded image
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

// Route to get all projects
router.get('', (req, res, next) => {
  Project.find().then(documents => {
    res.status(200).json({
      message: 'Projects fetched successfully!',
      projects: documents
    });
  });
});

// Route to get a specific project by ID
router.get('/:id', (req, res, next) => {
  Project.findById(req.params.id).then(project => {
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'Project not found!' });
    }
  });
});

// Route to get projects by creator ID
router.get('/creator/:id', (req, res, next) => {
  Project.find({ creator: req.params.id }).then(documents => {
    res.status(200).json({
      message: 'Projects fetched successfully!',
      projects: documents
    });
  });  
});

// Route to handle image uploads
router.post('/upload', checkAuth, async (req, res, next) => {
  try {
    res.json({ message: 'Images uploaded successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to add a new project
router.post('/', checkAuth, multler({ storage: storage }).array('images'), (req, res, next) => {
  // Parse project data from the request body
  const projectData = JSON.parse(req.body.project);
  const url = req.protocol + '://' + req.get('host');
  // Map filenames for uploaded images to URLs
  const filenames = req.files.map(file => url + '/images/' + file.filename);
  // Create a new Project instance with the parsed data
  const proj = new Project({
    title: projectData.title,
    start: projectData.start,
    end: projectData.end,
    team: projectData.team,
    techStack: projectData.techStack,
    repositoryUrl: projectData.repositoryUrl,
    description: projectData.description,
    imagesPaths: filenames,
    creator: req.userData.userId
  });

  // Save the project to the database
  proj.save().then(result => {
    res.status(201).json({
      message: 'Project added successfully',
      project: {
        ...result,
        id: result._id
      }
    });
  });
});

// Route to update an existing project by ID
router.put('/:id', checkAuth, multler({ storage: storage }).array('images'), (req, res, next) => {
  const projectId = req.params.id;
  const projectData = JSON.parse(req.body.project);
  const url = req.protocol + '://' + req.get('host');
  const filenames = req.files.map(file => url + '/images/' + file.filename);
  const defaultImagePath = url + '/images/default.png';

  // Find the existing project by ID
  Project.findById(projectId).then(project => {
    if (project) {

      // Handle default image path in case it needs to be replaced
      const oldImagePaths = project.imagesPaths;
      if(oldImagePaths.length >= 1 && oldImagePaths.some(path => path.startsWith(defaultImagePath))) {
        oldImagePaths.splice(oldImagePaths.indexOf(defaultImagePath), 1);
        filenames.push(...oldImagePaths);
      }
      else {
        filenames.push(...oldImagePaths);
      }
      
      // Prepare updated project data
      const updateProject = {
        title: projectData.title,
        start: projectData.start,
        end: projectData.end,
        team: projectData.team,
        techStack: projectData.techStack,
        repositoryUrl: projectData.repositoryUrl,
        description: projectData.description,
        imagesPaths: filenames,
        creator: projectData.creator
      };

      // Update the project in the database
      Project.updateOne({ _id: projectId }, updateProject).then(result => {
          res.status(201).json({
            message: 'Project updated successfully',
            project: {
              ...result,
              id: result._id
            }
          });
      }); 
    } 
    else {
      res.status(404).json({ message: 'Error updating the Project!' });
    }
  });
});

// Route to delete a project by ID
router.delete('/:id', checkAuth, (req, res, next) => {
  // Find the project by ID
  Project.findOne({ _id: req.params.id }).then(project => {
    if (!project) {
      return res.status(404).json({ message: 'Project not found!' });
    }

    // Check authorization for deletion
    if (req.userData.userId == project.creator || req.userData.isAdmin) {
      // Delete the project from the database
      Project.deleteOne({ _id: req.params.id }).then(result => {
        if (result.deletedCount > 0) {
          res.status(200).json({ message: 'Project deleted!' });
        }
        else {
          res.status(500).json({ message: 'Error deleting project!' });
        }
      });
    } else {
      res.status(401).json({ message: 'Not authorized!' });
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching project failed!'
      });
    });
});

module.exports = router;