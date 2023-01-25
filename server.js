// Require the app.js file containing all roots
const app = require('./app.js');

// Specify hostname and port
const hostname = '127.0.0.1';
const port = 8080;

// Create server at hostname and port specified
app.listen(port, hostname, () => {
  // Log that server has started and on which path
    console.log(`Server running at http://${hostname}:${port}/`);
  });
