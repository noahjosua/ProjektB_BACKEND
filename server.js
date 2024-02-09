const app = require('./app');
const debug = require('debug')('node-angular');
const http = require('http');

// Function to normalize the port value to a number, string, or false
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

// Function to handle server errors
const onError = error => {
  // Check if the error is related to a server listen operation
  if (error.syscall !== 'listen') { 
    throw error; // If not, throw the error for further investigation
  }
  // Determine the bind address and port for the server
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  // Handle specific error codes related to server listen failures
  switch (error.code) {
    case 'EACCES':
      // Error code for insufficient privileges (e.g., attempting to use a privileged port without elevated permissions)
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      // Error code for address already in use (e.g., the specified port is already being used by another process)
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error; // Throw any other error for further investigation
  }
};

// Function to handle server listening events
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  debug('Listening on ' + bind);
};

// Normalize the port value, either from environment variable or default to 3000
const port = normalizePort(process.env.PORT || '3000'); 

// Create an HTTP server and use the Express app as a listener for incoming requests
const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);