const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projects');
const userRoutes = require('./routes/user');
const cors = require('cors');
const app = express(); // Create an instance of the Express application

// Connect to the MongoDB database using the connection string stored in the environment variable
const DATABASE_URL = process.env.DATABASE_URL;
mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log(`Connected to database ${DATABASE_URL}`);
  })
  .catch(() => {
    console.log('Connection failed! Did you maybe forgot to add a .env file?')
  });

app.use(bodyParser.json()); // Use bodyParser middleware to parse JSON requests
app.use('/images', express.static(path.join('images'))); // Serve static images from the 'images' directory

// Set up CORS headers for handling cross-origin requests
app.use(cors({
  origin: '*', // 'https://projektsammlung-webentwicklung-basics.netlify.app'
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

// Set up routes for projects and user APIs
app.use('/api/projects', projectRoutes);
app.use('/api/user', userRoutes);

module.exports = app;