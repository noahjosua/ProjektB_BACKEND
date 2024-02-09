const jwt = require('jsonwebtoken');

// Middleware function to authenticate requests using JWT
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract the JWT from the 'Authorization' header in the request
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); // Verify the authenticity of the JWT using the secret key stored in the environment variable
        req.userData = { 
            email: decodedToken.email, 
            userId: decodedToken.userId, 
            isAdmin: decodedToken.isAdmin 
        };  // Attach decoded user information to the request object for further use in the route handlers
        next(); // Move to the next middleware or route handler in the chain
    } catch (error) {
        res.status(401).json({ message: 'You are not authenticated!' }); // If an error occurs during JWT verification, respond with a 401 Unauthorized status
    }
}; 