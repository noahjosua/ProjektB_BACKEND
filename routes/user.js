const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');
require('dotenv').config();

// Route to handle user signup
router.post('/signup', checkAuth, (req, res, next) => {
    // Hash the user's password before saving to the database
    bcrypt.hash(req.body.password, 10) 
        .then(hash => {
            // Create a new User instance with hashed password
            const user = new User({ 
                email: req.body.email,
                password: hash, 
                isAdmin: req.body.isAdmin
            });
            // Save the user to the database
            user.save() 
                .then(result => {
                    res.status(201).json({
                        message: 'User created!',
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
});

// Route to handle user login
router.post('/login', (req, res, next) => {
    // Find the user in the database based on email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) { // Return 401 Unauthorized if user not found
                return res.status(401).json({
                    message: 'Auth failed!'
                });
            }
            const fetchedUser = user;

            // Compare the entered password with the stored hashed password
            return bcrypt.compare(req.body.password, fetchedUser.password)
                .then(result => {
                    if (!result) { // Return 401 Unauthorized if password does not match
                        return res.status(401).json({
                            message: 'Auth failed!'
                        });
                    }
                    // Create a JWT token for successful authentication
                    const token = jwt.sign(
                        { email: fetchedUser.email, userId: fetchedUser._id, isAdmin: fetchedUser.isAdmin },
                        process.env.TOKEN_SECRET,
                        { expiresIn: '1h' }
                    );

                    // Return the token, expiration time, user ID, and isAdmin status in the response
                    res.status(200).json({
                        token: token,
                        expiresIn: 3600,
                        userId: fetchedUser._id,
                        isAdmin: fetchedUser.isAdmin
                    });
                });
        })
        .catch(err => {
            // Return 500 Internal Server Error if an error occurs during the process
            return res.status(500).json({
                error: err
            });
        });
});

// Placeholder route for handling user profile (to be implemented)
router.post('/profile', checkAuth, (req, res, next) => {

});

module.exports = router;