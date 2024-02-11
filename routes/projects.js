const Project = require('../models/project');
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
require('dotenv').config();
const multler = require('multer');
const fs = require('fs');

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

router.get('', (req, res, next) => {
  // #swagger.description = 'Endpoint to fetch all projects.'
  Project.find().then(documents => {
    res.status(200).json({
      message: 'Projects fetched successfully!',
      projects: documents
    });
  });
});

router.get('/:id', (req, res, next) => {
  // #swagger.description = 'Endpoint to fetch a specific project by ID.'
  Project.findById(req.params.id).then(project => {
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'Project not found!' });
    }
  });
});

router.get('/creator/:id', (req, res, next) => {
  // #swagger.description = 'Endpoint to fetch all projects created by a specific user.'
  Project.find({ creator: req.params.id }).then(documents => {
    res.status(200).json({
      message: 'Projects fetched successfully!',
      projects: documents
    });
  });  
});

router.post('/upload', checkAuth, async (req, res, next) => {
  // #swagger.description = 'Endpoint to upload images.'
  try {
    res.json({ message: 'Images uploaded successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', checkAuth, multler({ storage: storage }).array('images'), (req, res, next) => {
  // #swagger.description = 'Endpoint to add a new project.'
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

router.put('/:id', checkAuth, multler({ storage: storage }).array('images'), (req, res, next) => {
  // #swagger.description = 'Endpoint to update a project by ID.'
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

router.delete('/:id', checkAuth, (req, res, next) => {
  // #swagger.description = 'Endpoint to delete a project by ID.'
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
          for(let path of project.imagesPaths) {
            const filename = path.split('/images/')[1];
            fs.unlink('images/' + filename, (err) => {
              if (err) {
                console.error(err);
                return;
              }
            });
          }
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